import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateInquiryDto {
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

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  productIds?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  anonymousId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;
}
