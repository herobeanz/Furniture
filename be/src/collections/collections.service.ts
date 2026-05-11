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
    });
    return list.map(serializeCollection);
  }

  async findAllAdmin() {
    const list = await this.prisma.collection.findMany({
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
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
                category: {
                  include: {
                    room: true,
                  },
                },
              },
            },
          },
          orderBy: { order_index: 'asc' },
        },
      },
    });
    if (!collection) throw new NotFoundException(`Collection not found: ${id}`);
    
    const serialized = serializeCollection(collection);
    return {
      ...serialized,
      products: collection.products.map((cp: any) => {
        const p = cp.product;
        const primaryImage = p.images?.[0];
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          salePrice: p.sale_price ? Number(p.sale_price) : undefined,
          thumbnail: primaryImage?.image_url ?? p.thumbnail ?? undefined,
          orderIndex: cp.order_index,
          breadcrumb: p.category
            ? [
                { name: p.category.room.name, slug: p.category.room.slug },
                { name: p.category.name, slug: p.category.slug },
              ]
            : [],
        };
      }),
    };
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
                category: {
                  include: {
                    room: true,
                  },
                },
              },
            },
          },
          orderBy: { order_index: 'asc' },
        },
      },
    });
    if (!collection) throw new NotFoundException(`Collection not found: ${slug}`);
    
    const serialized = serializeCollection(collection);
    return {
      ...serialized,
      products: collection.products.map((cp: any) => {
        const p = cp.product;
        const primaryImage = p.images?.[0];
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          salePrice: p.sale_price ? Number(p.sale_price) : undefined,
          thumbnail: primaryImage?.image_url ?? p.thumbnail ?? undefined,
          breadcrumb: p.category
            ? [
                { name: p.category.room.name, slug: p.category.room.slug },
                { name: p.category.name, slug: p.category.slug },
              ]
            : [],
        };
      }),
    };
  }

  async create(dto: CreateCollectionDto) {
    let slug = dto.slug?.trim() || slugify(dto.name);
    const existing = await this.prisma.collection.findUnique({ where: { slug } });
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
      const taken = await this.prisma.collection.findUnique({ where: { slug } });
      if (taken) slug = `${slug}-${Date.now().toString(36)}`;
    } else {
      slug = existing.slug;
    }
    const collection = await this.prisma.collection.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name.trim() }),
        ...(slug != null && { slug }),
        ...(dto.description !== undefined && { description: dto.description?.trim() ?? null }),
        ...(dto.thumbnail !== undefined && { thumbnail: dto.thumbnail?.trim() ?? null }),
        ...(dto.orderIndex !== undefined && { order_index: dto.orderIndex }),
        ...(dto.isActive !== undefined && { is_active: dto.isActive }),
        ...(dto.seoTitle !== undefined && { seo_title: dto.seoTitle?.trim() ?? null }),
        ...(dto.seoDescription !== undefined && { seo_description: dto.seoDescription?.trim() ?? null }),
      },
    });
    return serializeCollection(collection);
  }

  async remove(id: number) {
    await this.prisma.collection.delete({ where: { id } });
    return { deleted: true };
  }

  async addProduct(collectionId: number, productId: number, orderIndex?: number) {
    const collection = await this.prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) throw new NotFoundException(`Collection not found: ${collectionId}`);
    
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product not found: ${productId}`);

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

  async updateProductOrder(collectionId: number, products: Array<{ productId: number; orderIndex: number }>) {
    const collection = await this.prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection) throw new NotFoundException(`Collection not found: ${collectionId}`);

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
