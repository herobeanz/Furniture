import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInquiryDto) {
    const inquiry = await this.prisma.inquiry.create({
      data: {
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        email: dto.email?.trim() || null,
        message: dto.message.trim(),
        productIds: dto.productIds ?? [],
        status: 'pending',
        anonymousId: dto.anonymousId ?? null,
        source: dto.source ?? null,
      },
    });
    return {
      id: inquiry.id,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      message: inquiry.message,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
    };
  }

  async findAll(page = 1, limit = 20, status?: string) {
    const where = status ? { status } : {};
    const [data, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
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
        productIds: i.productIds,
        status: i.status,
        source: i.source,
        createdAt: i.createdAt,
      })),
      total,
      page,
      limit,
    };
  }

  async updateStatus(id: string, status: string) {
    const inquiry = await this.prisma.inquiry.update({
      where: { id },
      data: { status },
    });
    return { id: inquiry.id, status: inquiry.status };
  }
}
