import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigurationMapper } from '../mappers/configuration.mapper';
import { VehicleCategoryConfigurationDto } from '../dto/vehicle-category-configuration.dto';
import { VEHICLE_CONFIGURATION_REPOSITORY } from '../repositories/vehicle-configuration.repository.interface';
import type { IVehicleConfigurationRepository } from '../repositories/vehicle-configuration.repository.interface';

/**
 * Orchestrates the read side only (Single Responsibility): fetch via the
 * repository abstraction, fail fast if nothing usable was found, map to
 * the response DTO. No query building or DTO shaping lives here.
 */
@Injectable()
export class ConfigurationQueryService {
  constructor(
    @Inject(VEHICLE_CONFIGURATION_REPOSITORY)
    private readonly vehicleConfigurationRepository: IVehicleConfigurationRepository,
    private readonly configurationMapper: ConfigurationMapper,
  ) {}

  async getVehicleCategoryConfiguration(
    categoryId: number,
  ): Promise<VehicleCategoryConfigurationDto> {
    const category =
      await this.vehicleConfigurationRepository.findActiveCategoryWithConfiguration(
        categoryId,
      );

    if (!category) {
      throw new NotFoundException(
        `Vehicle category ${categoryId} was not found or is inactive`,
      );
    }

    return this.configurationMapper.toVehicleCategoryConfiguration(category);
  }
}
