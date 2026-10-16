import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ServicePriceItemDto {
  @IsNotEmpty()
  @IsString()
  serviceId!: string;

  @IsNotEmpty()
  @IsString()
  vehicleTypeId!: string;

  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  price!: number;
}

export class SaveServicePricesDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one price item must be provided' })
  @ValidateNested({ each: true })
  @Type(() => ServicePriceItemDto)
  prices!: ServicePriceItemDto[];
}
