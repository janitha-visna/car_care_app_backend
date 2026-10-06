import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ServiceComponent } from './service-component.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, ServiceComponent])],
  exports: [TypeOrmModule],
})
export class ServiceModule {}
