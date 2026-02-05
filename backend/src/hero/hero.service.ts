import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateHeroItemDto } from './dto/create-hero-item.dto';
import type { UpdateHeroItemDto } from './dto/update-hero-item.dto';

@Injectable()
export class HeroService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public: active rooms for homepage, ordered by orderIndex */
  async findAllActive() {
    const list = await this.prisma.room.findMany({
      where: { is_active: true },
      orderBy: { order_index: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        thumbnail: true,
        order_index: true,
      },
    });
    return list.map((room: any) => ({
      id: room.id,
      title: room.name,
      link: `/${room.slug}`,
      imageUrl: room.thumbnail ?? undefined,
      orderIndex: room.order_index ?? room.orderIndex,
    }));
  }

  /** Admin: all rooms */
  async findAll() {
    const list = await this.prisma.room.findMany({
      orderBy: { order_index: 'asc' },
    });
    return list.map((room: any) => ({
      id: room.id,
      title: room.name,
      link: `/${room.slug}`,
      imageUrl: room.thumbnail ?? undefined,
      orderIndex: room.order_index ?? room.orderIndex,
      isActive: room.is_active ?? room.isActive,
      createdAt: room.created_at ?? room.createdAt,
      updatedAt: room.updated_at ?? room.updatedAt,
    }));
  }

  async findById(id: number) {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException(`Room not found: ${id}`);
    return {
      id: room.id,
      title: room.name,
      link: `/${room.slug}`,
      imageUrl: room.thumbnail ?? undefined,
      orderIndex: (room as any).order_index ?? (room as any).orderIndex,
      isActive: (room as any).is_active ?? (room as any).isActive,
      createdAt: (room as any).created_at ?? (room as any).createdAt,
      updatedAt: (room as any).updated_at ?? (room as any).updatedAt,
    };
  }

  async create(dto: CreateHeroItemDto) {
    // Hero items are now managed through Rooms
    throw new NotFoundException('Hero items are now managed through Rooms. Use /rooms endpoint instead.');
  }

  async update(id: number, dto: UpdateHeroItemDto) {
    // Hero items are now managed through Rooms
    throw new NotFoundException('Hero items are now managed through Rooms. Use /rooms endpoint instead.');
  }

  async remove(id: number) {
    // Hero items are now managed through Rooms
    throw new NotFoundException('Hero items are now managed through Rooms. Use /rooms endpoint instead.');
  }
}
