import { IsIn, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn(['pending', 'contacted', 'completed', 'cancelled'])
  status: string;
}
