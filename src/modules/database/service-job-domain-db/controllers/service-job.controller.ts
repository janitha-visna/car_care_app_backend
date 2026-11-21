import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CreateServiceJobDto } from '../dto/create-service-job.dto';
import { GetMonthlyRevenueQueryDto } from '../dto/get-monthly-revenue.dto';
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

  /**
   * GET /service-jobs/revenue/monthly?year=2026
   * Returns 12-month revenue and job count breakdown for the given year.
   */
  @Get('revenue/monthly')
  async getMonthlyRevenue(@Query() query: GetMonthlyRevenueQueryDto) {
    const year = query.year ?? new Date().getFullYear();
    return this.serviceJobService.getMonthlyRevenue(year);
  }
}
