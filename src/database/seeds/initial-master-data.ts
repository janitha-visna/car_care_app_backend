// src/database/seeds/initial-master-data.ts

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

export const COMPONENTS_AND_PARTS_DATA = [
  {
    componentName: 'Air Filter',
    parts: [
      {
        partNumber: 'AF-DENSO-STD',
        brand: 'Denso',
        name: 'Standard Air Filter Element',
      },
      {
        partNumber: 'AF-TOYOTA-OEM',
        brand: 'Toyota Genuine',
        name: 'Toyota OEM Air Filter',
      },
      {
        partNumber: 'AF-BOSCH-HD',
        brand: 'Bosch',
        name: 'Heavy Duty Air Filter',
      },
    ],
  },
  {
    componentName: 'Engine Oil Filter',
    parts: [
      {
        partNumber: 'OF-DENSO-MINI',
        brand: 'Denso',
        name: 'Spin-on Oil Filter Mini',
      },
      {
        partNumber: 'OF-TOYOTA-STD',
        brand: 'Toyota Genuine',
        name: 'Standard Oil Filter C-110',
      },
      {
        partNumber: 'OF-FLEETGUARD-HD',
        brand: 'Fleetguard',
        name: 'Commercial Heavy Duty Oil Filter',
      },
    ],
  },
  {
    componentName: 'Fuel Filter',
    parts: [
      {
        partNumber: 'FF-BOSCH-STD',
        brand: 'Bosch',
        name: 'Standard Inline Fuel Filter',
      },
      {
        partNumber: 'FF-DENSO-DIESEL',
        brand: 'Denso',
        name: 'Diesel Fuel Filter Assembly',
      },
    ],
  },
];

export const SERVICES_DATA = [
  {
    name: 'Full Service',
    basePrice: 7500.0,
  },
  {
    name: 'Normal Service',
    basePrice: 4500.0,
  },
  {
    name: 'Body Wash',
    basePrice: 2000.0,
  },
];
