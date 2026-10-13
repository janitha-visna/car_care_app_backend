import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleCategory } from './vehicle-category.entity';
import { VehicleType } from './vehicle-type.entity';
import { Customer } from '../customer-domain-db/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, VehicleCategory, VehicleType, Customer]),
  ],
  exports: [TypeOrmModule],
})
export class VehicleModule {}
