import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleCategory } from './vehicle-category.entity';
import { VehicleType } from './vehicle-type.entity';
import { Customer } from '../customer-domain-db/customer.entity';
import { CustomerPhoneNumber } from '../customer-domain-db/customer-phone-number.entity';
import { Service } from '../service-domain-db/entities/service.entity';
import { ServicePrice } from '../service-domain-db/entities/service-price.entity';
import { VehicleController } from './controllers/vehicle.controller';
import { VehicleLookupService } from './services/vehicle-lookup.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vehicle,
      VehicleCategory,
      VehicleType,
      Customer,
      CustomerPhoneNumber,
      Service,
      ServicePrice,
    ]),
  ],
  controllers: [VehicleController],
  providers: [VehicleLookupService],
  exports: [TypeOrmModule, VehicleLookupService],
})
export class VehicleModule {}
