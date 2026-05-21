import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { ReorderBlogPostsDto } from './dto/reorder-blog-posts.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Get blog posts (public)' })
  @ApiResponse({ status: 200, description: 'Blog posts retrieved' })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  getPosts(@Query('featured') featured?: string) {
    if (featured === 'true') {
      return this.blogService.findFeatured(3);
    }
    return this.blogService.findAll();
  }

  @Get('list/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get all blog posts' })
  @ApiResponse({ status: 200, description: 'All blog posts retrieved' })
  getAdminList() {
    return this.blogService.findAllAdmin();
  }

  @Get('by-id/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get blog post by ID' })
  @ApiResponse({ status: 200, description: 'Blog post retrieved' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findById(id);
  }

  @Get('preview/:slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Preview blog post by slug' })
  @ApiResponse({ status: 200, description: 'Blog post retrieved' })
  getPostPreview(@Param('slug') slug: string) {
    return this.blogService.findBySlugAdmin(slug);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get blog post by slug (public)' })
  @ApiResponse({ status: 200, description: 'Blog post retrieved' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  getPost(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create blog post' })
  @ApiResponse({ status: 201, description: 'Blog post created' })
  create(@Body() dto: CreateBlogPostDto) {
    return this.blogService.create(dto);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Reorder blog posts' })
  @ApiResponse({ status: 200, description: 'Blog post sort order updated' })
  reorder(@Body() dto: ReorderBlogPostsDto) {
    return this.blogService.reorder(dto.posts);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update blog post' })
  @ApiResponse({ status: 200, description: 'Blog post updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBlogPostDto) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete blog post' })
  @ApiResponse({ status: 200, description: 'Blog post deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}
