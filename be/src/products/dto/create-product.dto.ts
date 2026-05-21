import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsIn,
  MaxLength,
  Min,
  IsBoolean,
  IsDateString,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '@prisma/client';
import { ProductImageItemDto } from './product-image-item.dto';

export class CreateProductDto {
  @IsInt()
  categoryId: number;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  thumbnail?: string;

  @IsOptional()
  @IsString()
  @IsIn(['available', 'hidden', 'discontinued'])
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  soldCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isHot?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ProductImageItemDto)
  images?: ProductImageItemDto[];

   @IsOptional()
   @IsBoolean()
   isDailyFlashSale?: boolean;

   @IsOptional()
   @IsDateString()
   flashSaleEndAt?: string;

  @IsOptional()
  @IsBoolean()
  isContactPrice?: boolean;
}
