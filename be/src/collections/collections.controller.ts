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
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AddProductDto } from './dto/add-product.dto';
import { UpdateProductOrderDto } from './dto/update-product-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  getCollections() {
    return this.collectionsService.findAll();
  }

  @Get('list/all')
  @UseGuards(JwtAuthGuard)
  getAdminList() {
    return this.collectionsService.findAllAdmin();
  }

  @Get('by-id/:id')
  @UseGuards(JwtAuthGuard)
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.collectionsService.findById(id);
  }

  @Get(':slug')
  getCollection(@Param('slug') slug: string) {
    return this.collectionsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCollectionDto) {
    return this.collectionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.collectionsService.remove(id);
  }

  // Collection Products Management
  @Post(':id/products')
  @UseGuards(JwtAuthGuard)
  addProduct(
    @Param('id', ParseIntPipe) collectionId: number,
    @Body() dto: AddProductDto,
  ) {
    return this.collectionsService.addProduct(collectionId, dto.productId, dto.orderIndex);
  }

  @Delete(':id/products/:productId')
  @UseGuards(JwtAuthGuard)
  removeProduct(
    @Param('id', ParseIntPipe) collectionId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.collectionsService.removeProduct(collectionId, productId);
  }

  @Patch(':id/products/order')
  @UseGuards(JwtAuthGuard)
  updateProductOrder(
    @Param('id', ParseIntPipe) collectionId: number,
    @Body() dto: UpdateProductOrderDto,
  ) {
    return this.collectionsService.updateProductOrder(collectionId, dto.products);
  }
}
