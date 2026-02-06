import { IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ProductOrderItem {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(0)
  orderIndex: number;
}

export class UpdateProductOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderItem)
  products: ProductOrderItem[];
}
