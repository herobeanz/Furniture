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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved' })
  getCategories() {
    return this.categoriesService.findAll();
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree (Room → Category)' })
  @ApiResponse({ status: 200, description: 'Category tree retrieved' })
  getTree() {
    return this.categoriesService.findTree();
  }

  @Get('list/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get all categories' })
  @ApiResponse({ status: 200, description: 'All categories retrieved' })
  getAdminList() {
    return this.categoriesService.findAllAdmin();
  }

  @Get('by-id/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findById(id);
  }

  @Get('by-room/:roomId')
  @ApiOperation({ summary: 'Get categories by room ID' })
  @ApiResponse({ status: 200, description: 'Categories retrieved' })
  getByRoomId(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.categoriesService.findByRoomId(roomId);
  }

  @Get(':slug/products')
  @ApiOperation({ summary: 'Get products by category slug' })
  @ApiResponse({ status: 200, description: 'Products retrieved' })
  @ApiQuery({ name: 'roomSlug', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  getCategoryProducts(
    @Param('slug') slug: string,
    @Query('roomSlug') roomSlug?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.categoriesService.findProductsByCategorySlug(
      slug,
      roomSlug,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      sort ?? 'createdAt',
      order ?? 'desc',
    );
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({ status: 200, description: 'Category retrieved' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiQuery({ name: 'roomSlug', required: false })
  getCategory(@Param('slug') slug: string, @Query('roomSlug') roomSlug?: string) {
    return this.categoriesService.findBySlug(slug, roomSlug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update category' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
