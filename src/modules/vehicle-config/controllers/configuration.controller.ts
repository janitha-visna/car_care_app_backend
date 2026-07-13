import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ConfigurationQueryService } from '../services/configuration-query.service';
import { VehicleCategoryConfigurationDto } from '../dto/vehicle-category-configuration.dto';

@Controller('configuration')
export class ConfigurationController {
  constructor(
    private readonly configurationQueryService: ConfigurationQueryService,
  ) {}

  @Get('vehicle-category/:categoryId')
  getVehicleCategoryConfiguration(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<VehicleCategoryConfigurationDto> {
    return this.configurationQueryService.getVehicleCategoryConfiguration(
      categoryId,
    );
  }
}
