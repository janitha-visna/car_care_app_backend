import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ServicePrice } from './service-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServicePrice])],
  exports: [TypeOrmModule],
})
export class ServiceModule {}
