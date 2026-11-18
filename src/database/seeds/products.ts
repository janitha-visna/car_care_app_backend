export interface ProductMeasurementOption {
  id: string;
  partId: string;
  type: 'PIECE' | 'LOOSE' | 'CAN';
  unit: string;
  allowDecimal: boolean;
}

export interface ProductPart {
  id: string;
  componentId: string;
  name: string;
  measurementOptions: ProductMeasurementOption[];
}

export interface ProductComponent {
  id: string;
  name: string;
  parts: ProductPart[];
}

export const PRODUCTS_DATA: ProductComponent[] = [
  {
    id: '1',
    name: 'Air Filter',
    parts: [
      {
        id: '15',
        componentId: '1',
        name: 'Bosch',
        measurementOptions: [
          {
            id: '6',
            partId: '15',
            type: 'PIECE',
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
      {
        id: '14',
        componentId: '1',
        name: 'Toyota Genuine',
        measurementOptions: [
          {
            id: '5',
            partId: '14',
            type: 'PIECE',
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
      {
        id: '13',
        componentId: '1',
        name: 'Denso',
        measurementOptions: [
          {
            id: '4',
            partId: '13',
            type: 'PIECE',
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Engine Oil Filter',
    parts: [
      {
        id: '18',
        componentId: '2',
        name: 'Fleetguard',
        measurementOptions: [
          {
            id: '9',
            partId: '18',
            type: 'PIECE',
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
      {
        id: '17',
        componentId: '2',
        name: 'Toyota Genuine',
        measurementOptions: [
          {
            id: '8',
            partId: '17',
            type: 'PIECE',
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
      {
        id: '16',
        componentId: '2',
        name: 'Denso',
        measurementOptions: [
          {
            id: '7',
            partId: '16',
            type: 'PIECE',
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Fuel Filter',
    parts: [
      {
        id: '20',
        componentId: '3',
        name: 'Denso',
        measurementOptions: [
          {
            id: '11',
            partId: '20',
            type: 'PIECE',
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
      {
        id: '19',
        componentId: '3',
        name: 'Bosch',
        measurementOptions: [
          {
            id: '10',
            partId: '19',
            type: 'PIECE',
            unit: 'Pieces',
            allowDecimal: false,
          },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'Engine Oil',
    parts: [
      {
        id: '12',
        componentId: '5',
        name: 'DS40',
        measurementOptions: [
          {
            id: '3',
            partId: '12',
            type: 'LOOSE',
            unit: 'Litres',
            allowDecimal: true,
          },
        ],
      },
      {
        id: '11',
        componentId: '5',
        name: 'Mobil',
        measurementOptions: [
          {
            id: '2',
            partId: '11',
            type: 'CAN',
            unit: 'Cans',
            allowDecimal: false,
          },
        ],
      },
      {
        id: '10',
        componentId: '5',
        name: 'Castrol',
        measurementOptions: [
          {
            id: '1',
            partId: '10',
            type: 'CAN',
            unit: 'Cans',
            allowDecimal: false,
          },
        ],
      },
    ],
  },
];
