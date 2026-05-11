import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AddProductDto } from './dto/add-product.dto';
import { UpdateProductOrderDto } from './dto/update-product-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active collections (public)' })
  @ApiResponse({ status: 200, description: 'Collections retrieved' })
  getCollections() {
    return this.collectionsService.findAll();
  }

  @Get('list/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get all collections' })
  @ApiResponse({ status: 200, description: 'All collections retrieved' })
  getAdminList() {
    return this.collectionsService.findAllAdmin();
  }

  @Get('by-id/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Get collection by ID with products' })
  @ApiResponse({ status: 200, description: 'Collection retrieved' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.collectionsService.findById(id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get collection by slug with products (public)' })
  @ApiResponse({ status: 200, description: 'Collection retrieved' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  getCollection(@Param('slug') slug: string) {
    return this.collectionsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Create collection' })
  @ApiResponse({ status: 201, description: 'Collection created' })
  create(@Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update collection' })
  @ApiResponse({ status: 200, description: 'Collection updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCollectionDto) {
    return this.collectionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Delete collection' })
  @ApiResponse({ status: 200, description: 'Collection deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.collectionsService.remove(id);
  }

  @Post(':id/products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Add product to collection' })
  @ApiResponse({ status: 201, description: 'Product added' })
  addProduct(
    @Param('id', ParseIntPipe) collectionId: number,
    @Body() dto: AddProductDto,
  ) {
    return this.collectionsService.addProduct(collectionId, dto.productId, dto.orderIndex);
  }

  @Delete(':id/products/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Remove product from collection' })
  @ApiResponse({ status: 200, description: 'Product removed' })
  removeProduct(
    @Param('id', ParseIntPipe) collectionId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.collectionsService.removeProduct(collectionId, productId);
  }

  @Patch(':id/products/order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Update product order in collection' })
  @ApiResponse({ status: 200, description: 'Order updated' })
  updateProductOrder(
    @Param('id', ParseIntPipe) collectionId: number,
    @Body() dto: UpdateProductOrderDto,
  ) {
    return this.collectionsService.updateProductOrder(collectionId, dto.products);
  }
}
