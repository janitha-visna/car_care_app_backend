import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ServicePriceService } from '../services/service-price.service';
import { SaveServicePricesDto } from '../dto/save-service-prices.dto';

@Controller('service-prices')
export class ServicePriceController {
  constructor(private readonly servicePriceService: ServicePriceService) {}

  @Get('matrix')
  async getPriceMatrix() {
    return this.servicePriceService.getPriceMatrix();
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async savePrices(@Body() dto: SaveServicePricesDto) {
    return this.servicePriceService.savePrices(dto);
  }
}
