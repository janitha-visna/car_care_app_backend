import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { Customer } from '../customer-domain-db/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Customer])],
  exports: [TypeOrmModule],
})
export class VehicleModule {}
