import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServicePrice } from './entities/service-price.entity';
import { VehicleCategory } from '../vechile-domain-db/vehicle-category.entity';
import { VehicleType } from '../vechile-domain-db/vehicle-type.entity';
import { ServicePriceService } from './services/service-price.service';
import { ServicePriceController } from './controllers/service-price.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      ServicePrice,
      VehicleCategory,
      VehicleType,
    ]),
  ],
  controllers: [ServicePriceController],
  providers: [ServicePriceService],
  exports: [TypeOrmModule, ServicePriceService],
})
export class ServiceModule {}
