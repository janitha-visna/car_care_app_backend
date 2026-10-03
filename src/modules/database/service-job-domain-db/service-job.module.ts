import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceJob } from './service-job.entity';
import { Vehicle } from '../vechile-domain-db/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceJob, Vehicle])],
  exports: [TypeOrmModule],
})
export class ServiceJobModule {}
