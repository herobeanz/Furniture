import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CollectionOrderItem {
  @IsInt()
  id: number;

  @IsInt()
  @Min(0)
  orderIndex: number;
}

export class ReorderCollectionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CollectionOrderItem)
  collections: CollectionOrderItem[];
}
