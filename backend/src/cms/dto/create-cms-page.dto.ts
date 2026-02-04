import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateCmsPageDto {
  @IsString()
  @MaxLength(255)
  slug: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
