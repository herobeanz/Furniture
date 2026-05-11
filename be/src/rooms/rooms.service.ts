import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateRoomDto } from './dto/create-room.dto';
import type { UpdateRoomDto } from './dto/update-room.dto';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function serializeRoom(r: any) {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description ?? undefined,
    thumbnail: r.thumbnail ?? undefined,
    orderIndex: r.order_index ?? r.orderIndex,
    isActive: r.is_active ?? r.isActive,
    seoTitle: r.seo_title ?? r.seoTitle ?? undefined,
    seoDescription: r.seo_description ?? r.seoDescription ?? undefined,
  };
}

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.room.findMany({
      where: { is_active: true },
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
    });
    return list.map(serializeRoom);
  }

  async findAllAdmin() {
    const list = await this.prisma.room.findMany({
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
    });
    return list.map(serializeRoom);
  }

  async findById(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });
    if (!room) throw new NotFoundException(`Room not found: ${id}`);
    return serializeRoom(room);
  }

  async findBySlug(slug: string) {
    const room = await this.prisma.room.findFirst({
      where: { slug, is_active: true },
    });
    if (!room) throw new NotFoundException(`Room not found: ${slug}`);
    return serializeRoom(room);
  }

  async findCategoriesByRoomSlug(slug: string) {
    const room = await this.prisma.room.findFirst({
      where: { slug, is_active: true },
    });
    if (!room) throw new NotFoundException(`Room not found: ${slug}`);
    
    const categories = await this.prisma.category.findMany({
      where: { room_id: room.id, is_active: true },
      orderBy: [{ order_index: 'asc' }, { name: 'asc' }],
    });
    
    return categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? undefined,
      thumbnail: c.thumbnail ?? undefined,
      roomId: c.room_id,
      orderIndex: c.order_index,
      isActive: c.is_active,
      seoTitle: c.seo_title ?? undefined,
      seoDescription: c.seo_description ?? undefined,
    }));
  }

  async create(dto: CreateRoomDto) {
    let slug = dto.slug?.trim() || slugify(dto.name);
    const existing = await this.prisma.room.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;
    const room = await this.prisma.room.create({
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
    return serializeRoom(room);
  }

  async update(id: number, dto: UpdateRoomDto) {
    const existing = await this.prisma.room.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Room not found: ${id}`);
    let slug = dto.slug?.trim();
    if (slug && slug !== existing.slug) {
      const taken = await this.prisma.room.findUnique({ where: { slug } });
      if (taken) slug = `${slug}-${Date.now().toString(36)}`;
    } else {
      slug = existing.slug;
    }
    const room = await this.prisma.room.update({
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
    return serializeRoom(room);
  }

  async remove(id: number) {
    await this.prisma.room.delete({ where: { id } });
    return { deleted: true };
  }
}
