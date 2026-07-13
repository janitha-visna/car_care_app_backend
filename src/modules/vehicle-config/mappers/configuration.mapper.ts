import { Injectable } from '@nestjs/common';
import { VehicleCategory } from '../entities/vehicle-category.entity';
import {
  ServiceOptionDto,
  ServiceTypeDto,
  VehicleCategoryConfigurationDto,
  VehicleTypeDto,
} from '../dto/vehicle-category-configuration.dto';

/**
 * Single responsibility: turn the entity graph (with its junction table
 * and FK columns) into the flat, frontend-facing DTO shape. Keeping this
 * separate from the repository/service means the response contract can
 * evolve without touching query logic, and vice versa.
 */
@Injectable()
export class ConfigurationMapper {

  toVehicleCategoryConfiguration(
    category: VehicleCategory,
  ): VehicleCategoryConfigurationDto {

    const vehicleTypes = category.vehicleTypes ?? [];

    return {
      categoryId: category.id,
      category: category.name,

      vehicleTypes: vehicleTypes.map((vehicleType) => {
        return this.toVehicleType(vehicleType);
      }),
    };
  }


  private toVehicleType(vehicleType: any): VehicleTypeDto {

    const serviceMappings = vehicleType.serviceMappings ?? [];

    const services = serviceMappings
      .filter((mapping) => {
        return mapping.serviceType != null;
      })
      .map((mapping) => {
        return this.toServiceType(mapping.serviceType);
      });


    return {
      id: vehicleType.id,
      name: vehicleType.name,
      services: services,
    };
  }


  private toServiceType(serviceType: any): ServiceTypeDto {

    const options = serviceType.options ?? [];

    return {
      id: serviceType.id,
      name: serviceType.name,

      options: options.map((option) => {
        return this.toServiceOption(option);
      }),
    };
  }


  private toServiceOption(option: any): ServiceOptionDto {

    return {
      id: option.id,
      name: option.name,
      required: option.required,
    };
  }
}