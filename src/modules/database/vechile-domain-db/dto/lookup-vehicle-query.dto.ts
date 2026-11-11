import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LookupVehicleQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'plate query parameter is required' })
  @MaxLength(20)
  plate!: string;
}
