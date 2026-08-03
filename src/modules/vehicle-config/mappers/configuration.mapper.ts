import { Injectable } from '@nestjs/common';
import {
  ServiceOptionDto,
  ServiceTypeDto,
  VehicleCategoriesConfigurationDto,
  VehicleCategoryConfigurationDto,
  VehicleTypeDto,
} from '../dto/vehicle-category-configuration.dto';
import { VehicleCategory } from '../entities/vehicle-category.entity';

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
    return {
      categoryId: category.id,
      category: category.name,
      vehicleTypes: (category.vehicleTypes ?? []).map((vehicleType) =>
        this.toVehicleType(vehicleType),
      ),
    };
  }

  private toVehicleType(vehicleType: {
    id: number;
    name: string;
    availableServices?: {
      serviceType?: { id: number; name: string };
      serviceOption?: { id: number; name: string };
    }[];
  }): VehicleTypeDto {
    const servicesById = new Map<number, ServiceTypeDto>();

    for (const availableService of vehicleType.availableServices ?? []) {
      const serviceType = availableService.serviceType;
      const serviceOption = availableService.serviceOption;

      if (!serviceType || !serviceOption) {
        continue;
      }

      let service = servicesById.get(serviceType.id);
      if (!service) {
        service = {
          id: serviceType.id,
          name: serviceType.name,
          options: [],
        };
        servicesById.set(serviceType.id, service);
      }

      if (!service.options.some((option) => option.id === serviceOption.id)) {
        service.options.push(this.toServiceOption(serviceOption));
      }
    }

    return {
      id: vehicleType.id,
      name: vehicleType.name,
      services: Array.from(servicesById.values()),
    };
  }

  private toServiceOption(option: {
    id: number;
    name: string;
  }): ServiceOptionDto {
    return {
      id: option.id,
      name: option.name,
    };
  }
}
