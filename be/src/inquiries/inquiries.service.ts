import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InquiryStatus } from '@prisma/client';
import type { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInquiryDto) {
    if (dto.productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.productId },
      });
      if (!product) {
        throw new NotFoundException(`Product not found: ${dto.productId}`);
      }
    }

    const inquiry = await this.prisma.inquiry.create({
      data: {
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        email: dto.email?.trim() || null,
        message: dto.message.trim(),
        product_id: dto.productId ?? null,
        source: dto.source,
        status: 'new',
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    return {
      id: inquiry.id,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      message: inquiry.message,
      productId: (inquiry as any).product_id ?? (inquiry as any).productId,
      product: (inquiry as any).product,
      status: inquiry.status,
      source: inquiry.source,
      createdAt: (inquiry as any).created_at ?? (inquiry as any).createdAt,
    };
  }

  async findAll(page = 1, limit = 20, status?: InquiryStatus) {
    const where = status ? { status } : {};
    const [data, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.inquiry.count({ where }),
    ]);
    return {
      data: data.map((i) => ({
        id: i.id,
        name: i.name,
        phone: i.phone,
        email: i.email,
        message: i.message,
        productId: (i as any).product_id ?? (i as any).productId,
        product: (i as any).product,
        status: i.status,
        source: i.source,
        adminNotes: (i as any).admin_notes ?? (i as any).adminNotes,
        respondedAt: (i as any).responded_at ?? (i as any).respondedAt,
        createdAt: (i as any).created_at ?? (i as any).createdAt,
      })),
      total,
      page,
      limit,
    };
  }

  async updateStatus(id: number, status: InquiryStatus) {
    const inquiry = await this.prisma.inquiry.update({
      where: { id },
      data: {
        status,
        responded_at: status === 'done' ? new Date() : undefined,
      },
    });
    return { id: inquiry.id, status: inquiry.status };
  }
}
