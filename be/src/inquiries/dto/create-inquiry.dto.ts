import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';
import { InquirySource } from '@prisma/client';

export class CreateInquiryDto {
  @IsOptional()
  @IsInt()
  productId?: number;

  @IsString()
  @MinLength(1, { message: 'Họ tên không được để trống' })
  @MaxLength(255)
  name: string;

  @IsString()
  @MinLength(1, { message: 'Số điện thoại không được để trống' })
  @MaxLength(20)
  phone: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(255)
  email?: string;

  @IsString()
  @MinLength(1, { message: 'Nội dung không được để trống' })
  message: string;

  @IsEnum(InquirySource)
  source: InquirySource;
}
