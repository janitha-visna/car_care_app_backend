import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceJob } from './entities/service-job.entity';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceJob, Vehicle])],
  exports: [TypeOrmModule],
})
export class ServiceJobModule {}
