import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { SupplySource } from '../service-job-part.entity';

const toOptionalStringId = ({ value }: { value: unknown }): unknown => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number' || typeof value === 'string') {
    return String(value);
  }
  return value;
};

const toRequiredStringId = ({ value }: { value: unknown }): unknown => {
  if (typeof value === 'number' || typeof value === 'string') {
    return String(value);
  }
  return value;
};

export class ServiceJobVehicleDto {
  @IsOptional()
  @Transform(toOptionalStringId)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  id?: string | null;

  @IsString()
  @IsNotEmpty({ message: 'Vehicle numberPlate is required' })
  @MaxLength(20)
  numberPlate!: string;

  @Transform(toRequiredStringId)
  @IsString()
  @IsNotEmpty({ message: 'vehicleTypeId is required' })
  vehicleTypeId!: string;
}

export class ServiceJobCustomerPhoneDto {
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @MaxLength(20)
  number!: string;

  @IsBoolean()
  isPrimary!: boolean;
}

export class ServiceJobCustomerDto {
  @IsOptional()
  @Transform(toOptionalStringId)
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  id?: string | null;

  @IsString()
  @IsNotEmpty({ message: 'Customer name is required' })
  @MaxLength(255)
  name!: string;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'At least one customer phone number is required',
  })
  @ValidateNested({ each: true })
  @Type(() => ServiceJobCustomerPhoneDto)
  phones!: ServiceJobCustomerPhoneDto[];
}

export class ServiceJobProductItemDto {
  @Transform(toRequiredStringId)
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @Transform(toRequiredStringId)
  @IsString()
  @IsNotEmpty()
  brandId!: string;

  @Transform(toRequiredStringId)
  @IsString()
  @IsNotEmpty()
  measurementOptionId!: string;

  @IsNumber()
  @Min(0.01, { message: 'Product quantity must be greater than 0' })
  quantity!: number;

  @IsOptional()
  @IsEnum(SupplySource)
  supplySource?: SupplySource;
}

export class CreateServiceJobDto {
  @ValidateNested()
  @Type(() => ServiceJobVehicleDto)
  @IsNotEmpty()
  vehicle!: ServiceJobVehicleDto;

  @ValidateNested()
  @Type(() => ServiceJobCustomerDto)
  @IsNotEmpty()
  customer!: ServiceJobCustomerDto;

  @IsDateString({}, { message: 'jobDate must be a valid ISO date string' })
  jobDate!: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsNumber()
  @Min(0, { message: 'meterReading cannot be negative' })
  meterReading?: number | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsNumber()
  @Min(0, { message: 'nextMeterReading cannot be negative' })
  nextMeterReading?: number | null;

  @Transform(toRequiredStringId)
  @IsString()
  @IsNotEmpty({ message: 'servicePackageId is required' })
  servicePackageId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceJobProductItemDto)
  products!: ServiceJobProductItemDto[];

  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsNumber()
  @Min(0)
  estimatedCost?: number | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsNumber()
  @Min(0)
  totalCost?: number | null;
}
