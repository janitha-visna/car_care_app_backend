import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceJob } from './service-job.entity';
import { ServiceJobService } from './service-job-service.entity';
import { ServiceJobPart } from './service-job-part.entity';
import { Vehicle } from '../vechile-domain-db/vehicle.entity';
import { ServiceJobController } from './controllers/service-job.controller';
import { ServiceJobDomainService } from './services/service-job.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceJob,
      ServiceJobService,
      ServiceJobPart,
      Vehicle,
    ]),
  ],
  controllers: [ServiceJobController],
  providers: [ServiceJobDomainService],
  exports: [TypeOrmModule, ServiceJobDomainService],
})
export class ServiceJobModule {}
