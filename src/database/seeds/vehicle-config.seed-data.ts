/**
 * Source-of-truth seed data for the vehicle service configuration module.
 *
 * Read this from top to bottom:
 * 1. Create a vehicle category, such as Car.
 * 2. Create a vehicle type under it, such as Mini Car.
 * 3. Create the service packages available for that vehicle type.
 * 4. List the service options available under each service package.
 */

export const SERVICE_TYPE_NAMES = [
  'Body Wash',
  'Normal Service',
  'Full Service',
] as const;

export const SERVICE_OPTION_NAMES = [
  'Oil Spray',
  'Engine Oil Change',
  'Oil Filter Change',
  'Air Filter Change',
  'Gear Oil Change',
  'Interior Cleaning',
  'General Inspection',
  'Coolant Change',
] as const;

export type ServiceTypeName = (typeof SERVICE_TYPE_NAMES)[number];
export type ServiceOptionName = (typeof SERVICE_OPTION_NAMES)[number];

export interface VehicleTypeServiceSeed {
  serviceType: ServiceTypeName;
  serviceOptions: ServiceOptionName[];
}

export interface VehicleTypeSeed {
  name: string;
  services: VehicleTypeServiceSeed[];
}

export interface VehicleCategorySeed {
  category: string;
  vehicleTypes: VehicleTypeSeed[];
}

const BODY_WASH_OPTIONS: ServiceOptionName[] = [
  'Oil Spray',
  'Interior Cleaning',
];

const NORMAL_SERVICE_OPTIONS: ServiceOptionName[] = [
  'Engine Oil Change',
  'Oil Filter Change',
  'Air Filter Change',
  'General Inspection',
];

const FULL_SERVICE_OPTIONS: ServiceOptionName[] = [
  'Oil Spray',
  'Engine Oil Change',
  'Oil Filter Change',
  'Air Filter Change',
  'Gear Oil Change',
  'Interior Cleaning',
  'General Inspection',
  'Coolant Change',
];

const STANDARD_SERVICES: VehicleTypeServiceSeed[] = [
  {
    serviceType: 'Body Wash',
    serviceOptions: BODY_WASH_OPTIONS,
  },
  {
    serviceType: 'Normal Service',
    serviceOptions: NORMAL_SERVICE_OPTIONS,
  },
  {
    serviceType: 'Full Service',
    serviceOptions: FULL_SERVICE_OPTIONS,
  },
];

const BODY_WASH_ONLY_SERVICES: VehicleTypeServiceSeed[] = [
  {
    serviceType: 'Body Wash',
    serviceOptions: BODY_WASH_OPTIONS,
  },
];

export const VEHICLE_CATEGORY_SEEDS: VehicleCategorySeed[] = [
  {
    category: 'Car',
    vehicleTypes: [
      {
        name: 'Mini Car',
        services: STANDARD_SERVICES,
      },
      {
        name: 'Regular Car',
        services: STANDARD_SERVICES,
      },
    ],
  },
  {
    category: 'Van',
    vehicleTypes: [
      {
        name: 'Small Van',
        services: STANDARD_SERVICES,
      },
      {
        name: 'Medium Van',
        services: STANDARD_SERVICES,
      },
      {
        name: 'High Roof Van',
        services: STANDARD_SERVICES,
      },
    ],
  },
  {
    category: 'Bike',
    vehicleTypes: [
      {
        name: 'Regular Bike',
        services: BODY_WASH_ONLY_SERVICES,
      },
    ],
  },
  {
    category: 'Bus',
    vehicleTypes: [
      {
        name: 'Small Bus',
        services: STANDARD_SERVICES,
      },
      {
        name: 'Long Bus',
        services: STANDARD_SERVICES,
      },
      {
        name: 'Leyland Bus',
        services: STANDARD_SERVICES,
      },
    ],
  },
  {
    category: 'Lorry',
    vehicleTypes: [
      {
        name: 'Light Duty Lorry',
        services: STANDARD_SERVICES,
      },
      {
        name: 'Medium Duty Lorry',
        services: STANDARD_SERVICES,
      },
      {
        name: 'Heavy Duty Lorry',
        services: STANDARD_SERVICES,
      },
      {
        name: 'Tipper Truck',
        services: STANDARD_SERVICES,
      },
    ],
  },
  {
    category: 'Cab',
    vehicleTypes: [
      {
        name: 'Single Cab',
        services: STANDARD_SERVICES,
      },
      {
        name: 'Double Cab',
        services: STANDARD_SERVICES,
      },
    ],
  },
];
