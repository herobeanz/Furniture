import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

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

function serializeCategory(c: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  orderIndex: number;
}) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? undefined,
    imageUrl: c.imageUrl ?? undefined,
    parentId: c.parentId ?? undefined,
    orderIndex: c.orderIndex,
  };
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
  };
}

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        parentId: true,
        orderIndex: true,
      },
    });
    return list.map(serializeCategory);
  }

  async findAllAdmin() {
    const list = await this.prisma.category.findMany({
      orderBy: [{ orderIndex: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        parentId: true,
        orderIndex: true,
      },
    });
    return list.map(serializeCategory);
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        parentId: true,
        orderIndex: true,
      },
    });
    if (!category) throw new NotFoundException(`Category not found: ${id}`);
    return serializeCategory(category);
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findFirst({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        parentId: true,
        orderIndex: true,
      },
    });
    if (!category) throw new NotFoundException(`Category not found: ${slug}`);
    return serializeCategory(category);
  }

  async findProductsByCategorySlug(
    slug: string,
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    const category = await this.prisma.category.findFirst({
      where: { slug, isActive: true },
      select: { id: true },
    });
    if (!category) throw new NotFoundException(`Category not found: ${slug}`);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { categoryId: category.id, status: 'active' },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({
        where: { categoryId: category.id, status: 'active' },
      }),
    ]);

    return {
      data: products.map(serializeProduct),
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
        imageUrl: dto.imageUrl?.trim() ?? null,
        parentId: dto.parentId ?? null,
        orderIndex: dto.orderIndex ?? 0,
      },
    });
    return serializeCategory(category);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Category not found: ${id}`);
    let slug = dto.slug?.trim();
    if (slug && slug !== existing.slug) {
      const taken = await this.prisma.category.findUnique({ where: { slug } });
      if (taken) slug = `${slug}-${Date.now().toString(36)}`;
    } else {
      slug = existing.slug;
    }
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name.trim() }),
        ...(slug != null && { slug }),
        ...(dto.description !== undefined && { description: dto.description?.trim() ?? null }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl?.trim() ?? null }),
        ...(dto.parentId !== undefined && { parentId: dto.parentId ?? null }),
        ...(dto.orderIndex !== undefined && { orderIndex: dto.orderIndex }),
      },
    });
    return serializeCategory(category);
  }

  async remove(id: string) {
    await this.prisma.category.delete({ where: { id } });
    return { deleted: true };
  }
}
