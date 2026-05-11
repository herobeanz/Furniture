import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCmsPageDto } from './dto/create-cms-page.dto';
import type { UpdateCmsPageDto } from './dto/update-cms-page.dto';

@Injectable()
export class CmsService {
  private readonly logger = new Logger(CmsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string) {
    const page = await this.prisma.cmsPage.findFirst({
      where: { slug, is_active: true },
    });
    if (!page) throw new NotFoundException(`CMS page not found: ${slug}`);
    return {
      id: page.id,
      slug: page.slug,
      title: page.title,
      content: page.content,
      thumbnail: page.thumbnail ?? undefined,
      seoTitle: (page as any).seo_title ?? (page as any).seoTitle ?? undefined,
      seoDescription: (page as any).seo_description ?? (page as any).seoDescription ?? undefined,
      pageType: (page as any).page_type ?? (page as any).pageType ?? undefined,
      metaKeywords: (page as any).meta_keywords ?? (page as any).metaKeywords ?? undefined,
      publishedAt: (page as any).published_at ?? (page as any).publishedAt ?? undefined,
    };
  }

  async findAll() {
    const list = await this.prisma.cmsPage.findMany({
      orderBy: { slug: 'asc' },
    });
    return list.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      isActive: p.is_active ?? p.isActive,
      createdAt: p.created_at ?? p.createdAt,
    }));
  }

  async findActive() {
    const list = await this.prisma.cmsPage.findMany({
      where: { is_active: true },
      orderBy: { slug: 'asc' },
    });
    return list.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
    }));
  }

  async create(dto: CreateCmsPageDto) {
    const page = await this.prisma.cmsPage.create({
      data: {
        slug: dto.slug.trim(),
        title: dto.title.trim(),
        content: dto.content,
        thumbnail: dto.thumbnail?.trim() ?? null,
        seo_title: dto.seoTitle?.trim() ?? null,
        seo_description: dto.seoDescription?.trim() ?? null,
        page_type: dto.pageType?.trim() ?? null,
        is_active: dto.isActive ?? true,
        meta_keywords: dto.metaKeywords?.trim() ?? null,
        published_at: dto.publishedAt ? new Date(dto.publishedAt) : null,
      },
    });
    return { id: page.id, slug: page.slug, title: page.title };
  }

  async update(id: number, dto: UpdateCmsPageDto) {
    await this.prisma.cmsPage.update({
      where: { id },
      data: {
        ...(dto.slug != null && { slug: dto.slug.trim() }),
        ...(dto.title != null && { title: dto.title.trim() }),
        ...(dto.content != null && { content: dto.content }),
        ...(dto.thumbnail !== undefined && { thumbnail: dto.thumbnail?.trim() ?? null }),
        ...(dto.seoTitle !== undefined && { seo_title: dto.seoTitle?.trim() ?? null }),
        ...(dto.seoDescription !== undefined && { seo_description: dto.seoDescription?.trim() ?? null }),
        ...(dto.pageType !== undefined && { page_type: dto.pageType?.trim() ?? null }),
        ...(dto.isActive !== undefined && { is_active: dto.isActive }),
        ...(dto.metaKeywords !== undefined && { meta_keywords: dto.metaKeywords?.trim() ?? null }),
        ...(dto.publishedAt !== undefined && { published_at: dto.publishedAt ? new Date(dto.publishedAt) : null }),
      },
    });
    return this.findById(id);
  }

  async findById(id: number) {
    const page = await this.prisma.cmsPage.findUnique({ where: { id } });
    if (!page) throw new NotFoundException(`CMS page not found: ${id}`);
    return {
      id: page.id,
      slug: page.slug,
      title: page.title,
      content: page.content,
      thumbnail: page.thumbnail ?? undefined,
      seoTitle: (page as any).seo_title ?? (page as any).seoTitle ?? undefined,
      seoDescription: (page as any).seo_description ?? (page as any).seoDescription ?? undefined,
      pageType: (page as any).page_type ?? (page as any).pageType ?? undefined,
      isActive: (page as any).is_active ?? (page as any).isActive,
      metaKeywords: (page as any).meta_keywords ?? (page as any).metaKeywords ?? undefined,
      publishedAt: (page as any).published_at ?? (page as any).publishedAt ?? undefined,
      createdAt: (page as any).created_at ?? (page as any).createdAt,
    };
  }

  async remove(id: number) {
    await this.prisma.cmsPage.delete({ where: { id } });
    return { deleted: true };
  }
}
