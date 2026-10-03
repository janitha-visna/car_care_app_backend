import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceJob } from './service-job.entity';
import { ServiceJobService } from './service-job-service.entity';
import { ServiceJobPart } from './service-job-part.entity';
import { Vehicle } from '../vechile-domain-db/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceJob,
      ServiceJobService,
      ServiceJobPart,
      Vehicle,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class ServiceJobModule {}
