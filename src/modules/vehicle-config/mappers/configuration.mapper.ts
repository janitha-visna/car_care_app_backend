import { Injectable } from '@nestjs/common';
import { VehicleCategory } from '../entities/vehicle-category.entity';
import {
  ServiceOptionDto,
  ServiceTypeDto,
  VehicleCategoriesConfigurationDto,
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
  toVehicleCategoriesConfiguration(
    categories: VehicleCategory[],
  ): VehicleCategoriesConfigurationDto {
    return {
      categories: categories.map((category) =>
        this.toVehicleCategoryConfiguration(category),
      ),
    };
  }

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

  private toVehicleType(vehicleType: {
    id: number;
    name: string;
    serviceMappings: {
      serviceType: {
        id: number;
        name: string;
        options: { id: number; name: string; required: boolean }[];
      };
    }[];
  }): VehicleTypeDto {
    const serviceMappings = vehicleType.serviceMappings ?? [];

    const services = serviceMappings
      .filter((mapping) => mapping.serviceType != null)
      .map((mapping) => this.toServiceType(mapping.serviceType));

    return {
      id: vehicleType.id,
      name: vehicleType.name,
      services,
    };
  }

  private toServiceType(serviceType: {
    id: number;
    name: string;
    options: { id: number; name: string; required: boolean }[];
  }): ServiceTypeDto {
    const options = serviceType.options ?? [];

    return {
      id: serviceType.id,
      name: serviceType.name,
      options: options.map((option) => this.toServiceOption(option)),
    };
  }

  private toServiceOption(option: {
    id: number;
    name: string;
    required: boolean;
  }): ServiceOptionDto {
    return {
      id: option.id,
      name: option.name,
      required: option.required,
    };
  }
}
