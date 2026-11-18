export interface PriceVehicleType {
  id: string;
  name: string;
}

export interface PriceCategory {
  categoryId: string;
  categoryName: string;
  vehicleTypes: PriceVehicleType[];
}

export interface PriceService {
  id: string;
  name: string;
}

export interface PricesData {
  categories: PriceCategory[];
  services: PriceService[];
  prices: Record<string, number>;
}

export const PRICES_DATA: PricesData = {
  categories: [
    {
      categoryId: '1',
      categoryName: 'Bike',
      vehicleTypes: [
        {
          id: '1',
          name: 'Motorcycle',
        },
      ],
    },
    {
      categoryId: '2',
      categoryName: 'Car',
      vehicleTypes: [
        {
          id: '2',
          name: 'Small Car',
        },
        {
          id: '3',
          name: 'Regular Car',
        },
      ],
    },
    {
      categoryId: '3',
      categoryName: 'Cab',
      vehicleTypes: [
        {
          id: '4',
          name: 'Single Cab',
        },
        {
          id: '5',
          name: 'Double Cab',
        },
      ],
    },
    {
      categoryId: '4',
      categoryName: 'Van',
      vehicleTypes: [
        {
          id: '6',
          name: 'Regular Van',
        },
        {
          id: '7',
          name: 'High Roof Van',
        },
        {
          id: '8',
          name: 'Mini Van',
        },
      ],
    },
    {
      categoryId: '5',
      categoryName: 'Bus',
      vehicleTypes: [
        {
          id: '9',
          name: 'Small Bus',
        },
        {
          id: '10',
          name: 'Tata Long Bus',
        },
        {
          id: '11',
          name: 'Leyland Bus',
        },
      ],
    },
    {
      categoryId: '6',
      categoryName: 'Lorry',
      vehicleTypes: [
        {
          id: '12',
          name: '10 1/2 Lorry',
        },
        {
          id: '13',
          name: '14 1/2 Lorry',
        },
      ],
    },
    {
      categoryId: '7',
      categoryName: 'Commercial Vehicle',
      vehicleTypes: [
        {
          id: '14',
          name: 'Demo Batta',
        },
      ],
    },
    {
      categoryId: '8',
      categoryName: 'Tipper',
      vehicleTypes: [
        {
          id: '15',
          name: 'Small Tipper',
        },
        {
          id: '16',
          name: 'Big Tipper',
        },
      ],
    },
  ],
  services: [
    {
      id: '1',
      name: 'Full Service',
    },
    {
      id: '2',
      name: 'Normal Service',
    },
    {
      id: '3',
      name: 'Body Wash',
    },
  ],
  prices: {
    '1_1': 1800,
    '2_1': 1200,
    '3_1': 500,
    '1_2': 4500,
    '2_2': 3500,
    '3_2': 800,
    '1_3': 6000,
    '2_3': 4500,
    '3_3': 1000,
    '1_4': 7500,
    '2_4': 5500,
    '3_4': 1300,
    '1_5': 8500,
    '2_5': 6500,
    '3_5': 1500,
    '1_6': 7500,
    '2_6': 5500,
    '3_6': 1400,
    '1_7': 8500,
    '2_7': 6500,
    '3_7': 1600,
    '1_8': 5500,
    '2_8': 4000,
    '3_8': 1000,
    '1_9': 12000,
    '2_9': 9000,
    '3_9': 2500,
    '1_10': 16000,
    '2_10': 12000,
    '3_10': 3500,
    '1_11': 16500,
    '2_11': 12500,
    '3_11': 3500,
    '1_12': 10500,
    '2_12': 8000,
    '3_12': 2000,
    '1_13': 13500,
    '2_13': 10000,
    '3_13': 2500,
    '1_14': 6500,
    '2_14': 4800,
    '3_14': 1200,
    '1_15': 11500,
    '2_15': 8500,
    '3_15': 2200,
    '1_16': 18000,
    '2_16': 14000,
    '3_16': 4000,
  },
};
