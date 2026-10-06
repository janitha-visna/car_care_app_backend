import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleCategory } from './vehicle-category.entity';
import { VehicleType } from './vehicle-type.entity';
import { VehicleTypeService } from './vehicle-type-service.entity';
import { VehicleTypeComponentPart } from './vehicle-type-component-part.entity';
import { Customer } from '../customer-domain-db/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vehicle,
      VehicleCategory,
      VehicleType,
      VehicleTypeService,
      VehicleTypeComponentPart,
      Customer,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class VehicleModule {}
