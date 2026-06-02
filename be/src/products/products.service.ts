import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { ProductStatus } from '@prisma/client';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
import type { ProductImageItemDto } from './dto/product-image-item.dto';
import { slugify } from '../shared/utils/slugify';
import { serializeProductListItem } from '../shared/utils/product-serialize';

const MAX_PRODUCT_GALLERY_IMAGES = 10;

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
    isContactPrice: p.is_contact_price ?? p.isContactPrice ?? false,
    soldCount: p.sold_count ?? p.soldCount ?? 0,
    rating: toNumber(p.rating ?? null),
    isActive: p.is_active ?? p.isActive,
    isFeatured: p.is_featured ?? p.isFeatured,
    isHot: p.is_hot ?? p.isHot,
    isDailyFlashSale: p.is_daily_flash_sale ?? p.isDailyFlashSale ?? false,
    flashSaleEndAt: (p.flash_sale_end_at ?? p.flashSaleEndAt)?.toISOString?.() ?? null,
    seoTitle: p.seo_title ?? p.seoTitle ?? undefined,
    seoDescription: p.seo_description ?? p.seoDescription ?? undefined,
    images: imageUrls, // Array of image URL strings
    sortOrder: p.sort_order ?? p.sortOrder ?? 0,
    createdAt:
      (p.created_at ?? p.createdAt)?.toISOString?.() ?? undefined,
  };
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAdmin() {
    const products = await this.prisma.product.findMany({
      orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
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
        { short_description: { contains: params.search.trim(), mode: 'insensitive' } },
        { sku: { contains: params.search.trim(), mode: 'insensitive' } },
        { material: { contains: params.search.trim(), mode: 'insensitive' } },
        { color: { contains: params.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { [orderBy === 'createdAt' ? 'created_at' : orderBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: {
            orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
          },
          category: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const data = products.map((p: any) => {
      const result = serializeProductListItem(p) as ReturnType<
        typeof serializeProductListItem
      > & {
        breadcrumb?: { name: string; slug: string }[];
      };
      const category = p.category;
      if (category) {
        result.breadcrumb = [
          { name: category.name, slug: category.slug },
          { name: p.name, slug: p.slug },
        ];
      }
      return result;
    });

    return {
      data,
      total: totalCount,
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
        category: true,
      },
    });
    if (!product) throw new NotFoundException(`Product not found: ${id}`);
    const result = serializeProduct(product) as ReturnType<typeof serializeProduct> & {
      breadcrumb?: { name: string; slug: string }[];
    };
    const category = (product as any).category;
    if (category) {
      result.breadcrumb = [
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
        category: true,
      },
    });
    if (!product) throw new NotFoundException(`Product not found: ${slug}`);
    const result = serializeProduct(product) as ReturnType<typeof serializeProduct> & {
      breadcrumb?: { name: string; slug: string }[];
    };
    const category = (product as any).category;
    if (category) {
      result.breadcrumb = [
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
        category: true,
      },
    });

    // Map related products with breadcrumb so frontend can build proper URL
    return list.map((p: any) => {
      const result = serializeProductListItem(p) as ReturnType<
        typeof serializeProductListItem
      > & {
        breadcrumb?: { name: string; slug: string }[];
      };
      const category = p.category;
      if (category) {
        result.breadcrumb = [
          { name: category.name, slug: category.slug },
        ];
      }
      return result;
    });
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

  /**
   * Generate SKU based on category
   * Format: 3 letters from category name + "-" + 4 random digits
   * Example: SOF-1234
   */
  private async generateSku(categoryId: number): Promise<string> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { name: true },
    });
    
    if (!category) {
      throw new NotFoundException(`Category not found: ${categoryId}`);
    }

    // Get first 3 letters from category name (uppercase, remove spaces/special chars)
    const categoryPrefix = category.name
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .substring(0, 3)
      .padEnd(3, 'X'); // Pad with 'X' if less than 3 letters

    // Generate unique SKU by trying random 4-digit numbers
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      // Generate 4 random digits
      const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
      const sku = `${categoryPrefix}-${randomDigits}`;
      
      // Check if SKU already exists
      const existing = await this.prisma.product.findFirst({ where: { sku } });
      if (!existing) {
        return sku;
      }
      
      attempts++;
    }
    
    // Fallback: use timestamp if all attempts failed
    const timestamp = Date.now().toString().slice(-4);
    return `${categoryPrefix}-${timestamp}`;
  }

  private async syncProductImages(
    productId: number,
    images: ProductImageItemDto[] | undefined,
  ): Promise<void> {
    if (images === undefined) return;

    const items = images
      .map((img) => ({
        imageUrl: img.imageUrl?.trim(),
        isPrimary: img.isPrimary,
        altText: img.altText?.trim(),
        orderIndex: img.orderIndex,
      }))
      .filter((img) => !!img.imageUrl);

    if (items.length > MAX_PRODUCT_GALLERY_IMAGES) {
      throw new BadRequestException(
        `Tối đa ${MAX_PRODUCT_GALLERY_IMAGES} ảnh chi tiết cho mỗi sản phẩm`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { product_id: productId } });
      if (!items.length) return;
      await tx.productImage.createMany({
        data: items.map((img, index) => ({
          product_id: productId,
          image_url: img.imageUrl!,
          is_primary: img.isPrimary ?? index === 0,
          alt_text: img.altText ?? null,
          order_index: img.orderIndex ?? index,
        })),
      });
    });
  }

  async create(dto: CreateProductDto) {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category not found: ${dto.categoryId}`);
    }

    const rawSlug = dto.slug?.trim();
    let slug = rawSlug ? slugify(rawSlug) : slugify(dto.name);
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    // Generate SKU if not provided
    let sku = dto.sku?.trim();
    if (!sku) {
      sku = await this.generateSku(dto.categoryId);
    } else {
      // Check SKU uniqueness if provided
      const existingSku = await this.prisma.product.findFirst({ where: { sku } });
      if (existingSku) {
        throw new NotFoundException(`Product with SKU ${sku} already exists`);
      }
    }

    const maxSort = await this.prisma.product.findFirst({
      orderBy: { sort_order: 'desc' },
      select: { sort_order: true },
    });
    const nextSortOrder = maxSort ? maxSort.sort_order + 1 : 0;

    const product = await this.prisma.product.create({
      data: {
        name: dto.name.trim(),
        slug,
        sku,
        sort_order: nextSortOrder,
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
        sold_count: dto.soldCount ?? 0,
        rating: dto.rating ?? null,
        is_active: dto.isActive ?? true,
        is_featured: dto.isFeatured ?? false,
        is_hot: dto.isHot ?? false,
        is_daily_flash_sale: dto.isDailyFlashSale ?? false,
        is_contact_price: dto.isContactPrice ?? false,
        flash_sale_end_at: dto.flashSaleEndAt ? new Date(dto.flashSaleEndAt) : null,
        seo_title: dto.seoTitle?.trim() ?? null,
        seo_description: dto.seoDescription?.trim() ?? null,
      },
      include: {
        images: {
          orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
        },
      },
    });

    await this.syncProductImages(product.id, dto.images);

    const withImages = await this.prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: {
          orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
        },
      },
    });
    return serializeProduct(withImages ?? product);
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

    // Handle SKU update
    let sku = existing.sku;
    if (dto.sku !== undefined) {
      if (dto.sku.trim()) {
        // User provided SKU - check uniqueness
        const newSku = dto.sku.trim();
        if (newSku !== existing.sku) {
          const existingSku = await this.prisma.product.findFirst({ where: { sku: newSku } });
          if (existingSku) {
            throw new NotFoundException(`Product with SKU ${newSku} already exists`);
          }
          sku = newSku;
        }
      } else {
        // Empty SKU - regenerate based on current or new category
        const categoryId = dto.categoryId ?? existing.category_id;
        sku = await this.generateSku(categoryId);
      }
    }

    let slug = dto.slug !== undefined ? slugify(dto.slug.trim()) : undefined;
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
        sku,
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
        ...(dto.soldCount !== undefined && { sold_count: dto.soldCount }),
        ...(dto.rating !== undefined && { rating: dto.rating ?? null }),
        ...(dto.isActive !== undefined && { is_active: dto.isActive }),
        ...(dto.isFeatured !== undefined && { is_featured: dto.isFeatured }),
        ...(dto.isHot !== undefined && { is_hot: dto.isHot }),
        ...(dto.isDailyFlashSale !== undefined && { is_daily_flash_sale: dto.isDailyFlashSale }),
        ...(dto.isContactPrice !== undefined && { is_contact_price: dto.isContactPrice }),
        ...(dto.flashSaleEndAt !== undefined && {
          flash_sale_end_at: dto.flashSaleEndAt ? new Date(dto.flashSaleEndAt) : null,
        }),
        ...(dto.seoTitle !== undefined && { seo_title: dto.seoTitle?.trim() ?? null }),
        ...(dto.seoDescription !== undefined && { seo_description: dto.seoDescription?.trim() ?? null }),
      },
      include: {
        images: {
          orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
        },
      },
    });

    await this.syncProductImages(id, dto.images);

    const withImages = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
        },
      },
    });
    return serializeProduct(withImages ?? product);
  }

  async reorder(products: { id: number; sortOrder: number }[]) {
    if (!products.length) return { updated: 0 };
    await this.prisma.$transaction(
      products.map((item) =>
        this.prisma.product.update({
          where: { id: item.id },
          data: { sort_order: item.sortOrder },
        }),
      ),
    );
    return { updated: products.length };
  }

  async remove(id: number) {
    await this.prisma.product.delete({ where: { id } });
    return { deleted: true };
  }
}
