import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ElasticsearchService } from './elasticsearch.service';
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
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

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
    // Use Elasticsearch for search if enabled, otherwise use Prisma
    let productIds: number[] | null = null;
    let total = 0;

    if (params.search?.trim() && this.elasticsearchService.isEnabled()) {
      try {
        const searchResult = await this.elasticsearchService.searchProducts(
          params.search.trim(),
          (page - 1) * limit,
          limit,
        );
        productIds = searchResult.ids;
        total = searchResult.total;

        if (productIds.length === 0) {
          return {
            data: [],
            total: 0,
            page,
            limit,
          };
        }
      } catch (error) {
        this.logger.warn('Elasticsearch search failed, falling back to Prisma', error);
        // Fallback to Prisma search
      }
    }

    if (params.search?.trim() && !productIds) {
      // Prisma search fallback
      where.OR = [
        { name: { contains: params.search.trim(), mode: 'insensitive' } },
        { description: { contains: params.search.trim(), mode: 'insensitive' } },
        { short_description: { contains: params.search.trim(), mode: 'insensitive' } },
        { sku: { contains: params.search.trim(), mode: 'insensitive' } },
        { material: { contains: params.search.trim(), mode: 'insensitive' } },
        { color: { contains: params.search.trim(), mode: 'insensitive' } },
      ];
    }

    // If using Elasticsearch, filter by IDs
    if (productIds && productIds.length > 0) {
      where.id = { in: productIds };
    }

    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: productIds ? undefined : { [orderBy === 'createdAt' ? 'created_at' : orderBy]: sortOrder },
        skip: productIds ? 0 : (page - 1) * limit,
        take: productIds ? productIds.length : limit,
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
      productIds ? Promise.resolve(total) : this.prisma.product.count({ where }),
    ]);

    // Sort products by Elasticsearch order if using Elasticsearch
    let sortedProducts = products;
    if (productIds && productIds.length > 0) {
      const productMap = new Map(products.map((p) => [p.id, p]));
      sortedProducts = productIds
        .map((id) => productMap.get(id))
        .filter(Boolean)
        .slice(0, limit) as typeof products;
    }

    // Map products with breadcrumb
    const data = sortedProducts.map((p: any) => {
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
      total: total || totalCount,
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

    // Map related products with breadcrumb so frontend can build proper URL
    return list.map((p: any) => {
      const result = serializeProduct(p) as ReturnType<typeof serializeProduct> & {
        breadcrumb?: { name: string; slug: string }[];
      };
      const category = p.category;
      if (category) {
        result.breadcrumb = [
          { name: category.room.name, slug: category.room.slug },
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

    const product = await this.prisma.product.create({
      data: {
        name: dto.name.trim(),
        slug,
        sku,
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
