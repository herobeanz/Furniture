import { Injectable, NotFoundException } from '@nestjs/common';
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

function serializeCategory(c: any) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? undefined,
    thumbnail: c.thumbnail ?? undefined,
    roomId: c.room_id ?? c.roomId,
    orderIndex: c.order_index ?? c.orderIndex,
    isActive: c.is_active ?? c.isActive,
    seoTitle: c.seo_title ?? c.seoTitle ?? undefined,
    seoDescription: c.seo_description ?? c.seoDescription ?? undefined,
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
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.category.findMany({
      where: { is_active: true },
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
    });
    return list.map(serializeCategory);
  }

  /** Menu phân cấp: Room (Phòng) → Category (Sofa, Giường...) → Product (sản phẩm cụ thể). */
  async findTree(): Promise<CategoryTreeNode[]> {
    const rooms = await this.prisma.room.findMany({
      where: { is_active: true },
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        order_index: true,
      },
    });

    const categories = await this.prisma.category.findMany({
      where: { is_active: true },
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        room_id: true,
        order_index: true,
      },
    });

    const byRoomId = new Map<number, CategoryTreeNode[]>();
    categories.forEach((cat: any) => {
      const roomId = cat.room_id ?? cat.roomId;
      if (!byRoomId.has(roomId)) {
        byRoomId.set(roomId, []);
      }
      byRoomId.get(roomId)!.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        orderIndex: cat.order_index ?? cat.orderIndex,
        children: [], // Products sẽ được load khi vào trang category
      });
    });

    return rooms.map((room: any) => ({
      id: room.id,
      name: room.name,
      slug: room.slug,
      orderIndex: room.order_index ?? room.orderIndex,
      children: byRoomId.get(room.id) || [],
    }));
  }

  async findByRoomId(roomId: number) {
    const list = await this.prisma.category.findMany({
      where: { room_id: roomId, is_active: true },
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
    });
    return list.map(serializeCategory);
  }

  async findAllAdmin() {
    const list = await this.prisma.category.findMany({
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
    });
    return list.map(serializeCategory);
  }

  async findById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException(`Category not found: ${id}`);
    return serializeCategory(category);
  }

  async findBySlug(slug: string, roomSlug?: string) {
    const where: { slug: string; is_active: boolean; room?: { slug: string } } = {
      slug,
      is_active: true,
    };
    if (roomSlug) {
      where.room = { slug: roomSlug };
    }
    const category = await this.prisma.category.findFirst({
      where,
      include: {
        room: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    if (!category) throw new NotFoundException(`Category not found: ${slug}`);
    const result = serializeCategory(category) as ReturnType<typeof serializeCategory> & {
      breadcrumb?: { name: string; slug: string }[];
    };
    const breadcrumb = [
      { name: category.room.name, slug: category.room.slug },
      { name: category.name, slug: category.slug },
    ];
    result.breadcrumb = breadcrumb;
    return result;
  }

  /** Lấy tất cả products trong category. */
  async findProductsByCategorySlug(
    slug: string,
    roomSlug?: string,
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    const where: { slug: string; is_active: boolean; room?: { slug: string } } = {
      slug,
      is_active: true,
    };
    if (roomSlug) {
      where.room = { slug: roomSlug };
    }
    const category = await this.prisma.category.findFirst({
      where,
      select: { id: true },
    });
    if (!category) throw new NotFoundException(`Category not found: ${slug}`);

    // Get category with room for breadcrumb
    const categoryWithRoom = await this.prisma.category.findUnique({
      where: { id: category.id },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

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
      if (categoryWithRoom) {
        result.breadcrumb = [
          { name: categoryWithRoom.room.name, slug: categoryWithRoom.room.slug },
          { name: categoryWithRoom.name, slug: categoryWithRoom.slug },
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

  async create(dto: CreateCategoryDto) {
    // Verify room exists
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room not found: ${dto.roomId}`);
    }

    let slug = dto.slug?.trim() || slugify(dto.name);
    const existing = await this.prisma.category.findFirst({
      where: { slug, room_id: dto.roomId },
    });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;
    const category = await this.prisma.category.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() ?? null,
        thumbnail: dto.thumbnail?.trim() ?? null,
        room_id: dto.roomId,
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

    if (dto.roomId) {
      const room = await this.prisma.room.findUnique({
        where: { id: dto.roomId },
      });
      if (!room) {
        throw new NotFoundException(`Room not found: ${dto.roomId}`);
      }
    }

    let slug = dto.slug?.trim();
    const existingRoomId = (existing as any).room_id ?? (existing as any).roomId;
    const roomId = dto.roomId ?? existingRoomId;
    if (slug && slug !== existing.slug) {
      const taken = await this.prisma.category.findFirst({
        where: { slug, room_id: roomId },
      });
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
        ...(dto.thumbnail !== undefined && { thumbnail: dto.thumbnail?.trim() ?? null }),
        ...(dto.roomId !== undefined && { room_id: dto.roomId }),
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
}
