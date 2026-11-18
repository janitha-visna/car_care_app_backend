import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateServiceJobDto } from '../dto/create-service-job.dto';
import { ServiceJobDomainService } from '../services/service-job.service';

@Controller('service-jobs')
export class ServiceJobController {
  constructor(private readonly serviceJobService: ServiceJobDomainService) {}

  /**
   * POST /service-jobs
   * Atomically creates/updates customer, phone numbers, vehicle, meter reading,
   * and records the service job along with its service package and product line items.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createServiceJob(@Body() dto: CreateServiceJobDto) {
    return this.serviceJobService.createServiceJob(dto);
  }
}
