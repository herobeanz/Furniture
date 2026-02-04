import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCmsPageDto } from './dto/create-cms-page.dto';
import type { UpdateCmsPageDto } from './dto/update-cms-page.dto';

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string) {
    const page = await this.prisma.cmsPage.findFirst({
      where: { slug, isPublished: true },
    });
    if (!page) throw new NotFoundException(`CMS page not found: ${slug}`);
    return {
      id: page.id,
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle ?? undefined,
      metaDescription: page.metaDescription ?? undefined,
    };
  }

  async findAll() {
    const list = await this.prisma.cmsPage.findMany({
      orderBy: { slug: 'asc' },
    });
    return list.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      isPublished: p.isPublished,
      createdAt: p.createdAt,
    }));
  }

  async create(dto: CreateCmsPageDto) {
    const page = await this.prisma.cmsPage.create({
      data: {
        slug: dto.slug.trim(),
        title: dto.title.trim(),
        content: dto.content,
        metaTitle: dto.metaTitle?.trim() ?? null,
        metaDescription: dto.metaDescription?.trim() ?? null,
        isPublished: dto.isPublished ?? true,
      },
    });
    return { id: page.id, slug: page.slug, title: page.title };
  }

  async update(id: string, dto: UpdateCmsPageDto) {
    await this.prisma.cmsPage.update({
      where: { id },
      data: {
        ...(dto.slug != null && { slug: dto.slug.trim() }),
        ...(dto.title != null && { title: dto.title.trim() }),
        ...(dto.content != null && { content: dto.content }),
        ...(dto.metaTitle !== undefined && { metaTitle: dto.metaTitle?.trim() ?? null }),
        ...(dto.metaDescription !== undefined && { metaDescription: dto.metaDescription?.trim() ?? null }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
      },
    });
    return this.findById(id);
  }

  async findById(id: string) {
    const page = await this.prisma.cmsPage.findUnique({ where: { id } });
    if (!page) throw new NotFoundException(`CMS page not found: ${id}`);
    return {
      id: page.id,
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle ?? undefined,
      metaDescription: page.metaDescription ?? undefined,
      isPublished: page.isPublished,
      createdAt: page.createdAt,
    };
  }

  async remove(id: string) {
    await this.prisma.cmsPage.delete({ where: { id } });
    return { deleted: true };
  }
}
