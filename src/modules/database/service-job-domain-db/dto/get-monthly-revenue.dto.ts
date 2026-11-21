import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetMonthlyRevenueQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'year must be an integer' })
  @Min(2000, { message: 'year must be at least 2000' })
  @Max(2100, { message: 'year must be at most 2100' })
  year?: number;
}
