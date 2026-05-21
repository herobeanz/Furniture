import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InquiryStatus, Prisma } from '@prisma/client';
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

  private buildListWhere(
    status?: InquiryStatus,
    search?: string,
    dateFrom?: string,
    dateTo?: string,
  ): Prisma.InquiryWhereInput {
    const where: Prisma.InquiryWhereInput = {};
    if (status) {
      where.status = status;
    }
    const q = search?.trim();
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { message: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (dateFrom || dateTo) {
      where.created_at = {};
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (!Number.isNaN(from.getTime())) {
          from.setHours(0, 0, 0, 0);
          where.created_at.gte = from;
        }
      }
      if (dateTo) {
        const to = new Date(dateTo);
        if (!Number.isNaN(to.getTime())) {
          to.setHours(23, 59, 59, 999);
          where.created_at.lte = to;
        }
      }
    }
    return where;
  }

  async findAll(
    page = 1,
    limit = 20,
    status?: InquiryStatus,
    search?: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const where = this.buildListWhere(status, search, dateFrom, dateTo);
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
