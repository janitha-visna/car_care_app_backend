// src/database/seeds/initial-master-data.ts
import { MeasurementType } from '../../modules/database/part-domain-db/part-measurement-option.entity';

export interface SeedMeasurementOption {
  type: MeasurementType;
  unit: string;
  allowDecimal: boolean;
}

export interface SeedPartItem {
  name: string;
  measurementOptions: SeedMeasurementOption[];
}

export interface SeedComponentItem {
  componentName: string;
  parts: SeedPartItem[];
}

export const VEHICLE_CATEGORIES_DATA = [
  {
    name: 'Bike',
    types: [{ name: 'Motorcycle', description: 'Motorcycles and bikes' }],
  },
  {
    name: 'Car',
    types: [
      {
        name: 'Small Car',
        description: 'Compact & small cars (e.g. Alto, Kwid, Panda)',
      },
      {
        name: 'Regular Car',
        description: 'Standard sedans & hatchbacks (e.g. Corolla, Civic, Axio)',
      },
    ],
  },
  {
    name: 'Cab',
    types: [
      { name: 'Single Cab', description: 'Single cab pickup trucks' },
      {
        name: 'Double Cab',
        description: 'Double cab pickup trucks (e.g. Hilux, D-Max)',
      },
    ],
  },
  {
    name: 'Van',
    types: [
      {
        name: 'Regular Van',
        description: 'Standard passenger & delivery vans',
      },
      {
        name: 'High Roof Van',
        description: 'High roof passenger vans (e.g. KDH High Roof)',
      },
      { name: 'Mini Van', description: 'Small micro vans (e.g. Every, Hijet)' },
    ],
  },
  {
    name: 'Bus',
    types: [
      {
        name: 'Small Bus',
        description: 'Mini & midi passenger buses (e.g. Rosa, Coaster)',
      },
      {
        name: 'Tata Long Bus',
        description: 'Standard Tata commercial long bus',
      },
      {
        name: 'Leyland Bus',
        description: 'Ashok Leyland commercial passenger bus',
      },
    ],
  },
  {
    name: 'Lorry',
    types: [
      {
        name: '10 1/2 Lorry',
        description: '10.5 ft light commercial transport lorry',
      },
      {
        name: '14 1/2 Lorry',
        description: '14.5 ft medium commercial transport lorry',
      },
    ],
  },
  {
    name: 'Commercial Vehicle',
    types: [
      {
        name: 'Demo Batta',
        description:
          'Small commercial utility truck (e.g. Dimo Batta, Tata Ace)',
      },
    ],
  },
  {
    name: 'Tipper',
    types: [
      { name: 'Small Tipper', description: 'Light-duty dump/tipper truck' },
      {
        name: 'Big Tipper',
        description: 'Heavy-duty multi-axle dump/tipper truck',
      },
    ],
  },
];

export const COMPONENTS_AND_PARTS_DATA: SeedComponentItem[] = [
  {
    componentName: 'Engine Oil',
    parts: [
      {
        name: 'Castrol',
        measurementOptions: [
          {
            type: MeasurementType.CAN,
            unit: 'Cans',
            allowDecimal: false,
          },
        ],
      },
      {
        name: 'Mobil',
        measurementOptions: [
          {
            type: MeasurementType.CAN,
            unit: 'Cans',
            allowDecimal: false,
          },
        ],
      },
      {
        name: 'DS40',
        measurementOptions: [
          {
            type: MeasurementType.LOOSE,
            unit: 'Litres',
            allowDecimal: true,
          },
        ],
      },
    ],
  },
  {
    componentName: 'Air Filter',
    parts: [
      {
        name: 'Denso',
        measurementOptions: [
          {
            type: MeasurementType.PIECE,
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
      {
        name: 'Toyota Genuine',
        measurementOptions: [
          {
            type: MeasurementType.PIECE,
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
      {
        name: 'Bosch',
        measurementOptions: [
          {
            type: MeasurementType.PIECE,
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
    ],
  },
  {
    componentName: 'Engine Oil Filter',
    parts: [
      {
        name: 'Denso',
        measurementOptions: [
          {
            type: MeasurementType.PIECE,
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
      {
        name: 'Toyota Genuine',
        measurementOptions: [
          {
            type: MeasurementType.PIECE,
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
      {
        name: 'Fleetguard',
        measurementOptions: [
          {
            type: MeasurementType.PIECE,
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
    ],
  },
  {
    componentName: 'Fuel Filter',
    parts: [
      {
        name: 'Bosch',
        measurementOptions: [
          {
            type: MeasurementType.PIECE,
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
      {
        name: 'Denso',
        measurementOptions: [
          {
            type: MeasurementType.PIECE,
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
    ],
  },
];

export const SERVICES_DATA = [
  {
    name: 'Full Service',
  },
  {
    name: 'Normal Service',
  },
  {
    name: 'Body Wash',
  },
];
