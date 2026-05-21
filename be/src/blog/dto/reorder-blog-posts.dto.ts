import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BlogPostSortItem {
  @IsInt()
  id: number;

  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class ReorderBlogPostsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogPostSortItem)
  posts: BlogPostSortItem[];
}
