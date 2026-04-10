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
} from 'class-validator';
import { ProductStatus } from '@prisma/client';

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
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

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
