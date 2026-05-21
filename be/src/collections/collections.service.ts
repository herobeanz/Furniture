import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCollectionDto } from './dto/create-collection.dto';
import type { UpdateCollectionDto } from './dto/update-collection.dto';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function serializeCollection(c: any) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? undefined,
    thumbnail: c.thumbnail ?? undefined,
    orderIndex: c.order_index ?? c.orderIndex,
    isActive: c.is_active ?? c.isActive,
    seoTitle: c.seo_title ?? c.seoTitle ?? undefined,
    seoDescription: c.seo_description ?? c.seoDescription ?? undefined,
    createdAt: c.created_at ?? c.createdAt,
    updatedAt: c.updated_at ?? c.updatedAt,
    productCount: c._count?.products ?? c.productCount,
  };
}

function serializeCategoryRef(cat: any) {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    orderIndex: cat.order_index ?? cat.orderIndex ?? 0,
  };
}

function serializeCollectionProduct(cp: any) {
  const p = cp.product;
  const primaryImage = p.images?.[0];
  const imageUrls =
    p.images?.map((img: any) => img.image_url ?? img.imageUrl).filter(Boolean) ?? [];
  const category = p.category ? serializeCategoryRef(p.category) : undefined;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    shortDescription: p.short_description ?? undefined,
    price: Number(p.price),
    salePrice: p.sale_price ? Number(p.sale_price) : undefined,
    thumbnail: primaryImage?.image_url ?? p.thumbnail ?? undefined,
    images: imageUrls.length ? imageUrls : p.thumbnail ? [p.thumbnail] : [],
    material: p.material ?? undefined,
    categoryId: p.category_id ?? p.categoryId,
    isContactPrice: p.is_contact_price ?? false,
    orderIndex: cp.order_index,
    category,
    breadcrumb: category
      ? [
          { name: category.name, slug: category.slug },
          { name: p.name, slug: p.slug },
        ]
      : [],
  };
}

@Injectable()
export class CollectionsService {
  private readonly logger = new Logger(CollectionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.collection.findMany({
      where: { is_active: true },
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
      include: {
        _count: { select: { products: true } },
      },
    });
    return list.map(serializeCollection);
  }

  async findAllAdmin() {
    const list = await this.prisma.collection.findMany({
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
      include: {
        _count: { select: { products: true } },
      },
    });
    return list.map(serializeCollection);
  }

  async findById(id: number) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: {
                  where: { is_primary: true },
                  take: 1,
                },
                category: true,
              },
            },
          },
          orderBy: { order_index: 'asc' },
        },
      },
    });
    if (!collection) throw new NotFoundException(`Collection not found: ${id}`);

    const serialized = serializeCollection(collection);
    const products = collection.products.map(serializeCollectionProduct);
    return { ...serialized, productCount: products.length, products };
  }

  async findBySlug(slug: string) {
    const collection = await this.prisma.collection.findFirst({
      where: { slug, is_active: true },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: {
                  where: { is_primary: true },
                  take: 1,
                },
                category: true,
              },
            },
          },
          orderBy: { order_index: 'asc' },
        },
      },
    });
    if (!collection)
      throw new NotFoundException(`Collection not found: ${slug}`);

    const serialized = serializeCollection(collection);
    const products = collection.products.map(serializeCollectionProduct);
    const categoryMap = new Map<number, ReturnType<typeof serializeCategoryRef>>();
    for (const cp of collection.products) {
      if (cp.product?.category) {
        const ref = serializeCategoryRef(cp.product.category);
        categoryMap.set(ref.id, ref);
      }
    }
    const categories = [...categoryMap.values()].sort(
      (a, b) => a.orderIndex - b.orderIndex || a.name.localeCompare(b.name),
    );
    return {
      ...serialized,
      productCount: products.length,
      categories,
      products,
    };
  }

  async create(dto: CreateCollectionDto) {
    let slug = dto.slug?.trim() || slugify(dto.name);
    const existing = await this.prisma.collection.findUnique({
      where: { slug },
    });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;
    const collection = await this.prisma.collection.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() ?? null,
        thumbnail: dto.thumbnail?.trim() ?? null,
        order_index: dto.orderIndex ?? 0,
        is_active: dto.isActive ?? true,
        seo_title: dto.seoTitle?.trim() ?? null,
        seo_description: dto.seoDescription?.trim() ?? null,
      },
    });
    return serializeCollection(collection);
  }

  async update(id: number, dto: UpdateCollectionDto) {
    const existing = await this.prisma.collection.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Collection not found: ${id}`);
    let slug = dto.slug?.trim();
    if (slug && slug !== existing.slug) {
      const taken = await this.prisma.collection.findUnique({
        where: { slug },
      });
      if (taken) slug = `${slug}-${Date.now().toString(36)}`;
    } else {
      slug = existing.slug;
    }
    const collection = await this.prisma.collection.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name.trim() }),
        ...(slug != null && { slug }),
        ...(dto.description !== undefined && {
          description: dto.description?.trim() ?? null,
        }),
        ...(dto.thumbnail !== undefined && {
          thumbnail: dto.thumbnail?.trim() ?? null,
        }),
        ...(dto.orderIndex !== undefined && { order_index: dto.orderIndex }),
        ...(dto.isActive !== undefined && { is_active: dto.isActive }),
        ...(dto.seoTitle !== undefined && {
          seo_title: dto.seoTitle?.trim() ?? null,
        }),
        ...(dto.seoDescription !== undefined && {
          seo_description: dto.seoDescription?.trim() ?? null,
        }),
      },
    });
    return serializeCollection(collection);
  }

  async remove(id: number) {
    await this.prisma.collection.delete({ where: { id } });
    return { deleted: true };
  }

  async reorder(collections: { id: number; orderIndex: number }[]) {
    if (!collections.length) return { updated: 0 };
    await this.prisma.$transaction(
      collections.map((item) =>
        this.prisma.collection.update({
          where: { id: item.id },
          data: { order_index: item.orderIndex },
        }),
      ),
    );
    return { updated: collections.length };
  }

  async addProduct(
    collectionId: number,
    productId: number,
    orderIndex?: number,
  ) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });
    if (!collection)
      throw new NotFoundException(`Collection not found: ${collectionId}`);

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product)
      throw new NotFoundException(`Product not found: ${productId}`);

    // Check if product already in collection
    const existing = await this.prisma.collectionProduct.findUnique({
      where: {
        collection_id_product_id: {
          collection_id: collectionId,
          product_id: productId,
        },
      },
    });

    if (existing) {
      // Update order index if provided
      if (orderIndex !== undefined) {
        await this.prisma.collectionProduct.update({
          where: {
            collection_id_product_id: {
              collection_id: collectionId,
              product_id: productId,
            },
          },
          data: { order_index: orderIndex },
        });
      }
      return { added: true, alreadyExists: true };
    }

    // Get max order index if not provided
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined) {
      const maxOrder = await this.prisma.collectionProduct.findFirst({
        where: { collection_id: collectionId },
        orderBy: { order_index: 'desc' },
        select: { order_index: true },
      });
      finalOrderIndex = maxOrder ? maxOrder.order_index + 1 : 0;
    }

    await this.prisma.collectionProduct.create({
      data: {
        collection_id: collectionId,
        product_id: productId,
        order_index: finalOrderIndex,
      },
    });

    return { added: true };
  }

  async removeProduct(collectionId: number, productId: number) {
    const existing = await this.prisma.collectionProduct.findUnique({
      where: {
        collection_id_product_id: {
          collection_id: collectionId,
          product_id: productId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Product not found in collection');
    }

    await this.prisma.collectionProduct.delete({
      where: {
        collection_id_product_id: {
          collection_id: collectionId,
          product_id: productId,
        },
      },
    });

    return { removed: true };
  }

  async updateProductOrder(
    collectionId: number,
    products: Array<{ productId: number; orderIndex: number }>,
  ) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });
    if (!collection)
      throw new NotFoundException(`Collection not found: ${collectionId}`);

    // Update all products in a transaction
    await this.prisma.$transaction(
      products.map((item) =>
        this.prisma.collectionProduct.update({
          where: {
            collection_id_product_id: {
              collection_id: collectionId,
              product_id: item.productId,
            },
          },
          data: { order_index: item.orderIndex },
        }),
      ),
    );

    return { updated: true };
  }
}
