import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ConfigurationQueryService } from '../services/configuration-query.service';
import {
  VehicleCategoriesConfigurationDto,
  VehicleCategoryConfigurationDto,
} from '../dto/vehicle-category-configuration.dto';

@Controller('configuration')
export class ConfigurationController {
  constructor(
    private readonly configurationQueryService: ConfigurationQueryService,
  ) {}

  /**
   * Single call for the whole catalog — intended for the frontend to fetch
   * once at startup and reuse, instead of one request per category.
   */
  @Get('vehicle-categories')
  getAllVehicleCategoriesConfiguration(): Promise<VehicleCategoriesConfigurationDto> {
    return this.configurationQueryService.getAllVehicleCategoriesConfiguration();
  }

  @Get('vehicle-category/:categoryId')
  getVehicleCategoryConfiguration(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<VehicleCategoryConfigurationDto> {
    return this.configurationQueryService.getVehicleCategoryConfiguration(
      categoryId,
    );
  }
}
