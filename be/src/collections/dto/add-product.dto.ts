import { IsInt, Min, IsOptional } from 'class-validator';

export class AddProductDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
