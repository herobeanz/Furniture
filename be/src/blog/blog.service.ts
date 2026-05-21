import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function serializeBlogPost(p: any) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? undefined,
    content: p.content,
    thumbnail: p.thumbnail ?? undefined,
    category: p.category ?? undefined,
    author: p.author ?? undefined,
    seoTitle: p.seo_title ?? p.seoTitle ?? undefined,
    seoDescription: p.seo_description ?? p.seoDescription ?? undefined,
    isActive: p.is_active ?? p.isActive,
    isFeatured: p.is_featured ?? p.isFeatured,
    publishedAt:
      (p.published_at ?? p.publishedAt)?.toISOString?.() ?? undefined,
    createdAt:
      (p.created_at ?? p.createdAt)?.toISOString?.() ?? undefined,
    sortOrder: p.sort_order ?? p.sortOrder ?? 0,
    updatedAt:
      (p.updated_at ?? p.updatedAt)?.toISOString?.() ?? undefined,
  };
}

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const posts = await this.prisma.blogPost.findMany({
      where: {
        is_active: true,
        OR: [
          { published_at: null },
          { published_at: { lte: new Date() } },
        ],
      },
      orderBy: [
        { is_featured: 'desc' },
        { published_at: 'desc' },
        { created_at: 'desc' },
      ],
    });
    return posts.map(serializeBlogPost);
  }

  async findAllAdmin() {
    const posts = await this.prisma.blogPost.findMany({
      orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }],
    });
    return posts.map(serializeBlogPost);
  }

  async findById(id: number) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
    });
    if (!post) throw new NotFoundException(`Blog post not found: ${id}`);
    return serializeBlogPost(post);
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: {
        slug,
        is_active: true,
        OR: [
          { published_at: null },
          { published_at: { lte: new Date() } },
        ],
      },
    });
    if (!post) throw new NotFoundException(`Blog post not found: ${slug}`);
    return serializeBlogPost(post);
  }

  async findBySlugAdmin(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug },
    });
    if (!post) throw new NotFoundException(`Blog post not found: ${slug}`);
    return serializeBlogPost(post);
  }

  async findFeatured(limit = 3) {
    const posts = await this.prisma.blogPost.findMany({
      where: {
        is_active: true,
        is_featured: true,
        OR: [
          { published_at: null },
          { published_at: { lte: new Date() } },
        ],
      },
      orderBy: [
        { published_at: 'desc' },
        { created_at: 'desc' },
      ],
      take: limit,
    });
    return posts.map(serializeBlogPost);
  }

  async create(dto: CreateBlogPostDto) {
    let slug = dto.slug?.trim() || slugify(dto.title);
    const existing = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const maxSort = await this.prisma.blogPost.findFirst({
      orderBy: { sort_order: 'desc' },
      select: { sort_order: true },
    });
    const nextSortOrder = maxSort ? maxSort.sort_order + 1 : 0;

    const post = await this.prisma.blogPost.create({
      data: {
        title: dto.title.trim(),
        slug,
        sort_order: nextSortOrder,
        excerpt: dto.excerpt?.trim() ?? null,
        content: dto.content.trim(),
        thumbnail: dto.thumbnail?.trim() ?? null,
        category: dto.category?.trim() ?? null,
        author: dto.author?.trim() ?? null,
        seo_title: dto.seoTitle?.trim() ?? null,
        seo_description: dto.seoDescription?.trim() ?? null,
        is_active: dto.isActive ?? true,
        is_featured: dto.isFeatured ?? false,
        published_at: dto.publishedAt ?? null,
      },
    });
    return serializeBlogPost(post);
  }

  async update(id: number, dto: UpdateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Blog post not found: ${id}`);

    let slug = dto.slug?.trim();
    if (slug && slug !== existing.slug) {
      const taken = await this.prisma.blogPost.findUnique({ where: { slug } });
      if (taken) slug = `${slug}-${Date.now().toString(36)}`;
    } else {
      slug = existing.slug;
    }

    const post = await this.prisma.blogPost.update({
      where: { id },
      data: {
        ...(dto.title != null && { title: dto.title.trim() }),
        ...(slug != null && { slug }),
        ...(dto.excerpt !== undefined && { excerpt: dto.excerpt?.trim() ?? null }),
        ...(dto.content !== undefined && { content: dto.content.trim() }),
        ...(dto.thumbnail !== undefined && { thumbnail: dto.thumbnail?.trim() ?? null }),
        ...(dto.category !== undefined && { category: dto.category?.trim() ?? null }),
        ...(dto.author !== undefined && { author: dto.author?.trim() ?? null }),
        ...(dto.seoTitle !== undefined && { seo_title: dto.seoTitle?.trim() ?? null }),
        ...(dto.seoDescription !== undefined && { seo_description: dto.seoDescription?.trim() ?? null }),
        ...(dto.isActive !== undefined && { is_active: dto.isActive }),
        ...(dto.isFeatured !== undefined && { is_featured: dto.isFeatured }),
        ...(dto.publishedAt !== undefined && { published_at: dto.publishedAt ?? null }),
      },
    });
    return serializeBlogPost(post);
  }

  async reorder(posts: { id: number; sortOrder: number }[]) {
    if (!posts.length) return { updated: 0 };
    await this.prisma.$transaction(
      posts.map((item) =>
        this.prisma.blogPost.update({
          where: { id: item.id },
          data: { sort_order: item.sortOrder },
        }),
      ),
    );
    return { updated: posts.length };
  }

  async remove(id: number) {
    await this.prisma.blogPost.delete({ where: { id } });
    return { deleted: true };
  }
}
