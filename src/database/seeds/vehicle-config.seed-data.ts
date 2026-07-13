/**
 * Source-of-truth seed data for the vehicle service configuration module.
 * Mirrors the "Vehicle Service Configuration Requirements" doc. Editing
 * this file and re-running the seed script is the intended way to adjust
 * the initial/default configuration — no application code changes needed
 * for the values themselves (only this data changes; the schema doesn't).
 */

export const SERVICE_TYPE_NAMES = [
  'Body Wash',
  'Normal Service',
  'Full Service',
] as const;

export const SERVICE_OPTION_NAMES = [
  'Engine Oil Change',
  'Oil Filter Change',
  'Air Filter Change',
  'Gear Oil Change',
  'Interior Cleaning',
  'Oil Spray',
  'Tyre Polish',
  'Dashboard Polish',
  'Wax Polish',
  'Vacuum Cleaning',
  'Glass Cleaning',
] as const;

export interface VehicleCategorySeed {
  category: string;
  subcategories: string[];
  supportedServices: (typeof SERVICE_TYPE_NAMES)[number][];
}

export const VEHICLE_CATEGORY_SEEDS: VehicleCategorySeed[] = [
  {
    category: 'Motorcycle',
    subcategories: ['Regular Bike'],
    supportedServices: ['Body Wash'],
  },
  {
    category: 'Car',
    subcategories: ['Small Car', 'Regular Car'],
    supportedServices: ['Body Wash', 'Normal Service', 'Full Service'],
  },
  {
    category: 'Van',
    subcategories: ['Mini Van', 'Regular Van', 'High Roof Van'],
    supportedServices: ['Body Wash', 'Normal Service', 'Full Service'],
  },
  {
    category: 'Cab',
    subcategories: ['Single Cab', 'Double Cab'],
    supportedServices: ['Body Wash', 'Normal Service', 'Full Service'],
  },
  {
    category: 'Lorry',
    subcategories: [
      'Light Duty Lorry',
      'Medium Duty Lorry',
      'Heavy Duty Lorry',
      'Tipper Truck',
    ],
    supportedServices: ['Body Wash', 'Normal Service', 'Full Service'],
  },
  {
    category: 'Bus',
    subcategories: ['Small Bus', 'Long Bus', 'Leyland Bus'],
    supportedServices: ['Body Wash', 'Normal Service', 'Full Service'],
  },
];
