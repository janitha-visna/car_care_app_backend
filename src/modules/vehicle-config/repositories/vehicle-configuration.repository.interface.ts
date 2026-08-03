import { VehicleCategory } from '../entities/vehicle-category.entity';

export interface IVehicleConfigurationRepository {
  findCategoryWithConfiguration(
    categoryId: number,
  ): Promise<VehicleCategory | null>;

  findAllCategoriesWithConfiguration(): Promise<VehicleCategory[]>;
}

export const VEHICLE_CONFIGURATION_REPOSITORY = Symbol(
  'VEHICLE_CONFIGURATION_REPOSITORY',
);
