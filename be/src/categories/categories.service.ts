import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

export interface CategoryTreeNode {
  id: number;
  name: string;
  slug: string;
  orderIndex: number;
  children: CategoryTreeNode[];
}

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

function serializeCategory(c: any, productCount?: number) {
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
    productCount: productCount ?? c._count?.products ?? 0,
  };
}

function serializeProduct(p: any) {
  // Convert images array to array of image URLs (strings)
  const imageUrls = p.images?.map((img: any) => img.image_url ?? img.imageUrl).filter(Boolean) ?? [];
  
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    shortDescription: p.short_description ?? p.shortDescription ?? undefined,
    price: toNumber(p.price) ?? 0,
    salePrice: toNumber(p.sale_price ?? p.salePrice),
    sku: p.sku,
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
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.category.findMany({
      where: { is_active: true },
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
    });
    return list.map(serializeCategory);
  }

  /** Danh sách category phẳng cho menu Sản phẩm (mỗi node không có children). */
  async findTree(): Promise<CategoryTreeNode[]> {
    const categories = await this.prisma.category.findMany({
      where: { is_active: true },
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        order_index: true,
      },
    });

    return categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      orderIndex: cat.order_index ?? cat.orderIndex,
      children: [],
    }));
  }

  async findAllAdmin() {
    const list = await this.prisma.category.findMany({
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
      include: {
        _count: { select: { products: true } },
      },
    });
    return list.map((c) => serializeCategory(c, c._count.products));
  }

  async findById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException(`Category not found: ${id}`);
    return serializeCategory(category);
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findFirst({
      where: { slug, is_active: true },
    });
    if (!category) throw new NotFoundException(`Category not found: ${slug}`);
    const result = serializeCategory(category) as ReturnType<typeof serializeCategory> & {
      breadcrumb?: { name: string; slug: string }[];
    };
    result.breadcrumb = [{ name: category.name, slug: category.slug }];
    return result;
  }

  /** Lấy tất cả products trong category. */
  async findProductsByCategorySlug(
    slug: string,
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    const category = await this.prisma.category.findFirst({
      where: { slug, is_active: true },
      select: { id: true, name: true, slug: true },
    });
    if (!category) throw new NotFoundException(`Category not found: ${slug}`);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { category_id: category.id, status: 'available', is_active: true },
        orderBy: { [sort === 'createdAt' ? 'created_at' : sort]: order },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: {
            orderBy: [{ is_primary: 'desc' }, { order_index: 'asc' }],
          },
        },
      }),
      this.prisma.product.count({
        where: { category_id: category.id, status: 'available', is_active: true },
      }),
    ]);

    // Map products with breadcrumb
    const data = products.map((p: any) => {
      const result = serializeProduct(p) as ReturnType<typeof serializeProduct> & {
        breadcrumb?: { name: string; slug: string }[];
      };
      result.breadcrumb = [
        { name: category.name, slug: category.slug },
        { name: p.name, slug: p.slug },
      ];
      return result;
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async create(dto: CreateCategoryDto) {
    let slug = dto.slug?.trim() || slugify(dto.name);
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;
    const category = await this.prisma.category.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() ?? null,
        thumbnail: dto.thumbnail?.trim() ?? null,
        order_index: dto.orderIndex ?? 0,
        seo_title: dto.seoTitle?.trim() ?? null,
        seo_description: dto.seoDescription?.trim() ?? null,
      },
    });
    return serializeCategory(category);
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Category not found: ${id}`);

    let slug = dto.slug?.trim();
    if (slug && slug !== existing.slug) {
      const taken = await this.prisma.category.findUnique({ where: { slug } });
      if (taken && taken.id !== id) slug = `${slug}-${Date.now().toString(36)}`;
    } else {
      slug = existing.slug;
    }
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name.trim() }),
        ...(slug != null && { slug }),
        ...(dto.description !== undefined && { description: dto.description?.trim() ?? null }),
        ...(dto.thumbnail !== undefined && { thumbnail: dto.thumbnail?.trim() ?? null }),
        ...(dto.orderIndex !== undefined && { order_index: dto.orderIndex }),
        ...(dto.seoTitle !== undefined && { seo_title: dto.seoTitle?.trim() ?? null }),
        ...(dto.seoDescription !== undefined && { seo_description: dto.seoDescription?.trim() ?? null }),
      },
    });
    return serializeCategory(category);
  }

  async remove(id: number) {
    await this.prisma.category.delete({ where: { id } });
    return { deleted: true };
  }

  async reorder(categories: { id: number; orderIndex: number }[]) {
    if (!categories.length) return { updated: 0 };

    await this.prisma.$transaction(
      categories.map((item) =>
        this.prisma.category.update({
          where: { id: item.id },
          data: { order_index: item.orderIndex },
        }),
      ),
    );

    return { updated: categories.length };
  }
}
