import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
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

function serializeProduct(p: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: Decimal;
  comparePrice: Decimal | null;
  sku: string | null;
  categoryId: string | null;
  images: string[];
  status: string;
  stockQuantity: number;
  weight: Decimal | null;
  dimensions: string | null;
  material: string | null;
  color: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    shortDescription: p.shortDescription ?? undefined,
    price: toNumber(p.price) ?? 0,
    comparePrice: toNumber(p.comparePrice),
    sku: p.sku ?? undefined,
    categoryId: p.categoryId ?? undefined,
    images: p.images ?? [],
    status: p.status,
    stockQuantity: p.stockQuantity,
    weight: toNumber(p.weight),
    dimensions: p.dimensions ?? undefined,
    material: p.material ?? undefined,
    color: p.color ?? undefined,
    metaTitle: p.metaTitle ?? undefined,
    metaDescription: p.metaDescription ?? undefined,
  };
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllAdmin() {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
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

    const where: Record<string, unknown> = { status: 'active' };
    if (params.category) {
      const cat = await this.prisma.category.findFirst({
        where: { slug: params.category, isActive: true },
        select: { id: true },
      });
      if (cat) where.categoryId = cat.id;
    }
    if (params.search?.trim()) {
      where.OR = [
        { name: { contains: params.search.trim(), mode: 'insensitive' } },
        { description: { contains: params.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { [orderBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map(serializeProduct),
      total,
      page,
      limit,
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) throw new NotFoundException(`Product not found: ${id}`);
    return serializeProduct(product);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'active' },
    });
    if (!product) throw new NotFoundException(`Product not found: ${slug}`);
    return serializeProduct(product);
  }

  async findRelated(categoryId: string | null, excludeId: string, limit: number) {
    const where: Record<string, unknown> = { status: 'active', id: { not: excludeId } };
    if (categoryId) where.categoryId = categoryId;
    const list = await this.prisma.product.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return list.map(serializeProduct);
  }

  async findRelatedBySlug(slug: string, limit: number) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'active' },
      select: { id: true, categoryId: true },
    });
    if (!product) return [];
    return this.findRelated(product.categoryId, product.id, limit);
  }

  async create(dto: CreateProductDto) {
    let slug = dto.slug?.trim() || slugify(dto.name);
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;
    const product = await this.prisma.product.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() ?? null,
        price: dto.price,
        comparePrice: dto.comparePrice ?? null,
        categoryId: dto.categoryId ?? null,
        images: dto.images ?? [],
        status: dto.status ?? 'active',
      },
    });
    return serializeProduct(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Product not found: ${id}`);
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
        ...(dto.description !== undefined && { description: dto.description?.trim() ?? null }),
        ...(dto.price != null && { price: dto.price }),
        ...(dto.comparePrice !== undefined && { comparePrice: dto.comparePrice ?? null }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId ?? null }),
        ...(dto.images !== undefined && { images: dto.images }),
        ...(dto.status != null && { status: dto.status }),
      },
    });
    return serializeProduct(product);
  }

  async remove(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { deleted: true };
  }
}
