/**
 * Shape returned by GET /configuration/vehicle-category/:categoryId.
 * This is the ONLY contract the frontend needs to know about — it renders
 * vehicle types, services, and options purely from this structure, with
 * no business rules of its own.
 */
export interface ServiceOptionDto {
  id: number;
  name: string;
  required: boolean;
}

export interface ServiceTypeDto {
  id: number;
  name: string;
  options: ServiceOptionDto[];
}

export interface VehicleTypeDto {
  id: number;
  name: string;
  services: ServiceTypeDto[];
}

export interface VehicleCategoryConfigurationDto {
  categoryId: number;
  category: string;
  vehicleTypes: VehicleTypeDto[];
}
