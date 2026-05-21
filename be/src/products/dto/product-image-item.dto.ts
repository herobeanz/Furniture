import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ProductImageItemDto {
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
