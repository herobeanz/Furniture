import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { ProductStatus } from '@prisma/client';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function toNumber(value: Decimal | null | undefined): number | undefined {
  if (value == null) return undefined;
  return Number(value);
}

function serializeProduct(p: any) {
  // Convert images array to array of image URLs (strings)
  const imageUrls = p.images?.map((img: any) => img.image_url ?? img.imageUrl).filter(Boolean) ?? [];
  
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    description: p.description ?? '',
    shortDescription: p.short_description ?? p.shortDescription ?? undefined,
    price: toNumber(p.price) ?? 0,
    salePrice: toNumber(p.sale_price ?? p.salePrice),
    categoryId: p.category_id ?? p.categoryId,
    thumbnail: p.thumbnail ?? undefined,
    status: p.status,
    material: p.material ?? undefined,
    dimensions: p.dimensions ?? undefined,
    color: p.color ?? undefined,
    warranty: p.warranty ?? undefined,
    isActive: p.is_active ?? p.isActive,
    isFeatured: p.is_featured ?? p.isFeatured,
    isHot: p.is_hot ?? p.isHot,
    seoTitle: p.seo_title ?? p.seoTitle ?? undefined,
    seoDescription: p.seo_description ?? p.seoDescription ?? undefined,
    images: imageUrls, // Array of image URL strings
  };
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAdmin() {
    const products = await this.prisma.product.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        images: {
          orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
        },
      },
    });
    return products.map(serializeProduct);
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }) {
    const page = params.page ?? 1;
    const limit = Math.min(params.limit ?? 20, 100);
    const orderBy = (params.sort ?? 'createdAt') as string;
    const sortOrder = params.order ?? 'desc';

    const where: Record<string, unknown> = { status: 'available', is_active: true };
    if (params.category) {
      // category có thể là category slug
      const category = await this.prisma.category.findFirst({
        where: { slug: params.category, is_active: true },
        select: { id: true },
      });
      if (category) {
        where.category_id = category.id;
      }
    }
    if (params.search?.trim()) {
      where.OR = [
        { name: { contains: params.search.trim(), mode: 'insensitive' } },
        { description: { contains: params.search.trim(), mode: 'insensitive' } },
        { sku: { contains: params.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { [orderBy === 'createdAt' ? 'created_at' : orderBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: {
            orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
          },
          category: {
            include: {
              room: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Map products with breadcrumb
    const data = products.map((p: any) => {
      const result = serializeProduct(p) as ReturnType<typeof serializeProduct> & {
        breadcrumb?: { name: string; slug: string }[];
      };
      const category = p.category;
      if (category) {
        result.breadcrumb = [
          { name: category.room.name, slug: category.room.slug },
          { name: category.name, slug: category.slug },
          { name: p.name, slug: p.slug },
        ];
      }
      return result;
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
        },
        category: {
          include: {
            room: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
    if (!product) throw new NotFoundException(`Product not found: ${id}`);
    const result = serializeProduct(product) as ReturnType<typeof serializeProduct> & {
      breadcrumb?: { name: string; slug: string }[];
    };
    const category = (product as any).category;
    if (category) {
      result.breadcrumb = [
        { name: category.room.name, slug: category.room.slug },
        { name: category.name, slug: category.slug },
        { name: (product as any).name, slug: (product as any).slug },
      ];
    }
    return result;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'available', is_active: true },
      include: {
        images: {
          orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
        },
        category: {
          include: {
            room: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
    if (!product) throw new NotFoundException(`Product not found: ${slug}`);
    const result = serializeProduct(product) as ReturnType<typeof serializeProduct> & {
      breadcrumb?: { name: string; slug: string }[];
    };
    const category = (product as any).category;
    if (category) {
      result.breadcrumb = [
        { name: category.room.name, slug: category.room.slug },
        { name: category.name, slug: category.slug },
        { name: (product as any).name, slug: (product as any).slug },
      ];
    }
    return result;
  }

  async findRelated(categoryId: number | null, excludeId: number, limit: number) {
    const where: Record<string, unknown> = { status: 'available', is_active: true, id: { not: excludeId } };
    if (categoryId) {
      where.category_id = categoryId;
    }
    const list = await this.prisma.product.findMany({
      where,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        images: {
          orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
        },
      },
    });
    return list.map(serializeProduct);
  }

  async findRelatedBySlug(slug: string, limit: number) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'available', is_active: true },
      select: { id: true, category_id: true },
    });
    const categoryId = (product as any).category_id ?? (product as any).categoryId;
    if (!product || !categoryId) return [];
    return this.findRelated(categoryId, product.id, limit);
  }

  async create(dto: CreateProductDto) {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category not found: ${dto.categoryId}`);
    }

    let slug = dto.slug?.trim() || slugify(dto.name);
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    // Check SKU uniqueness
    const existingSku = await this.prisma.product.findFirst({ where: { sku: dto.sku } });
    if (existingSku) {
      throw new NotFoundException(`Product with SKU ${dto.sku} already exists`);
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name.trim(),
        slug,
        sku: dto.sku.trim(),
        short_description: dto.shortDescription?.trim() ?? null,
        description: dto.description?.trim() ?? null,
        price: dto.price,
        sale_price: dto.salePrice ?? null,
        category_id: dto.categoryId,
        thumbnail: dto.thumbnail?.trim() ?? null,
        status: dto.status ?? 'available',
        material: dto.material?.trim() ?? null,
        dimensions: dto.dimensions?.trim() ?? null,
        color: dto.color?.trim() ?? null,
        warranty: dto.warranty?.trim() ?? null,
        is_active: dto.isActive ?? true,
        is_featured: dto.isFeatured ?? false,
        is_hot: dto.isHot ?? false,
        seo_title: dto.seoTitle?.trim() ?? null,
        seo_description: dto.seoDescription?.trim() ?? null,
      },
      include: {
        images: {
          orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
        },
      },
    });
    return serializeProduct(product);
  }

  async update(id: number, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Product not found: ${id}`);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category not found: ${dto.categoryId}`);
      }
    }

    if (dto.sku && dto.sku !== existing.sku) {
      const existingSku = await this.prisma.product.findFirst({ where: { sku: dto.sku } });
      if (existingSku) {
        throw new NotFoundException(`Product with SKU ${dto.sku} already exists`);
      }
    }

    let slug = dto.slug?.trim();
    if (slug && slug !== existing.slug) {
      const taken = await this.prisma.product.findUnique({ where: { slug } });
      if (taken) slug = `${slug}-${Date.now().toString(36)}`;
    } else {
      slug = existing.slug;
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name.trim() }),
        ...(slug != null && { slug }),
        ...(dto.sku != null && { sku: dto.sku.trim() }),
        ...(dto.shortDescription !== undefined && { short_description: dto.shortDescription?.trim() ?? null }),
        ...(dto.description !== undefined && { description: dto.description?.trim() ?? null }),
        ...(dto.price != null && { price: dto.price }),
        ...(dto.salePrice !== undefined && { sale_price: dto.salePrice ?? null }),
        ...(dto.categoryId !== undefined && { category_id: dto.categoryId }),
        ...(dto.thumbnail !== undefined && { thumbnail: dto.thumbnail?.trim() ?? null }),
        ...(dto.status != null && { status: dto.status }),
        ...(dto.material !== undefined && { material: dto.material?.trim() ?? null }),
        ...(dto.dimensions !== undefined && { dimensions: dto.dimensions?.trim() ?? null }),
        ...(dto.color !== undefined && { color: dto.color?.trim() ?? null }),
        ...(dto.warranty !== undefined && { warranty: dto.warranty?.trim() ?? null }),
        ...(dto.isActive !== undefined && { is_active: dto.isActive }),
        ...(dto.isFeatured !== undefined && { is_featured: dto.isFeatured }),
        ...(dto.isHot !== undefined && { is_hot: dto.isHot }),
        ...(dto.seoTitle !== undefined && { seo_title: dto.seoTitle?.trim() ?? null }),
        ...(dto.seoDescription !== undefined && { seo_description: dto.seoDescription?.trim() ?? null }),
      },
      include: {
        images: {
          orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
        },
      },
    });
    return serializeProduct(product);
  }

  async remove(id: number) {
    await this.prisma.product.delete({ where: { id } });
    return { deleted: true };
  }
}
