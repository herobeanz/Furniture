import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ElasticsearchService } from './elasticsearch.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ElasticsearchService],
  exports: [ProductsService],
})
export class ProductsModule {}
