import { VehicleCategory } from '../entities/vehicle-category.entity';

/**
 * Abstraction the service layer depends on (Dependency Inversion) instead
 * of a concrete TypeORM repository. Lets the query strategy change (e.g.
 * swap the join approach, add caching) without touching ConfigurationQueryService.
 */
export interface IVehicleConfigurationRepository {
  /**
   * Loads a single vehicle category with its full active configuration
   * tree: vehicle types -> enabled service mappings -> service types ->
   * service options, all filtered to isActive and ordered by sortOrder.
   * Returns null if the category doesn't exist or is inactive.
   */
  findActiveCategoryWithConfiguration(
    categoryId: number,
  ): Promise<VehicleCategory | null>;

  /**
   * Same tree as findActiveCategoryWithConfiguration, but for every active
   * category at once — backs the "single call at startup" endpoint.
   */
  findAllActiveCategoriesWithConfiguration(): Promise<VehicleCategory[]>;
}

export const VEHICLE_CONFIGURATION_REPOSITORY = Symbol(
  'VEHICLE_CONFIGURATION_REPOSITORY',
);
