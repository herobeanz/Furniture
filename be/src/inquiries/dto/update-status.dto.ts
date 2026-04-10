import { IsEnum } from 'class-validator';
import { InquiryStatus } from '@prisma/client';

export class UpdateStatusDto {
  @IsEnum(InquiryStatus)
  status: InquiryStatus;
}
