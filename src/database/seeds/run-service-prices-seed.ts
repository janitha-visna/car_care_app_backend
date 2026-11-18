// src/database/seeds/run-service-prices-seed.ts
import { AppDataSource } from '../data-source';
import { VehicleCategory } from '../../modules/database/vechile-domain-db/vehicle-category.entity';
import { VehicleType } from '../../modules/database/vechile-domain-db/vehicle-type.entity';
import { Service } from '../../modules/database/service-domain-db/entities/service.entity';
import { ServicePrice } from '../../modules/database/service-domain-db/entities/service-price.entity';

interface VehicleTypePriceFixture {
  categoryName: string;
  vehicleTypeName: string;
  prices: {
    'Full Service': number;
    'Normal Service': number;
    'Body Wash': number;
  };
}

export const ALL_VEHICLE_SERVICE_PRICES: VehicleTypePriceFixture[] = [
  // 1. Bike
  {
    categoryName: 'Bike',
    vehicleTypeName: 'Motorcycle',
    prices: {
      'Full Service': 1800,
      'Normal Service': 1200,
      'Body Wash': 500,
    },
  },
  // 2. Car
  {
    categoryName: 'Car',
    vehicleTypeName: 'Small Car',
    prices: {
      'Full Service': 4500,
      'Normal Service': 3500,
      'Body Wash': 800,
    },
  },
  {
    categoryName: 'Car',
    vehicleTypeName: 'Regular Car',
    prices: {
      'Full Service': 6000,
      'Normal Service': 4500,
      'Body Wash': 1000,
    },
  },
  // 3. Cab
  {
    categoryName: 'Cab',
    vehicleTypeName: 'Single Cab',
    prices: {
      'Full Service': 7500,
      'Normal Service': 5500,
      'Body Wash': 1300,
    },
  },
  {
    categoryName: 'Cab',
    vehicleTypeName: 'Double Cab',
    prices: {
      'Full Service': 8500,
      'Normal Service': 6500,
      'Body Wash': 1500,
    },
  },
  // 4. Van
  {
    categoryName: 'Van',
    vehicleTypeName: 'Regular Van',
    prices: {
      'Full Service': 7500,
      'Normal Service': 5500,
      'Body Wash': 1400,
    },
  },
  {
    categoryName: 'Van',
    vehicleTypeName: 'High Roof Van',
    prices: {
      'Full Service': 8500,
      'Normal Service': 6500,
      'Body Wash': 1600,
    },
  },
  {
    categoryName: 'Van',
    vehicleTypeName: 'Mini Van',
    prices: {
      'Full Service': 5500,
      'Normal Service': 4000,
      'Body Wash': 1000,
    },
  },
  // 5. Bus
  {
    categoryName: 'Bus',
    vehicleTypeName: 'Small Bus',
    prices: {
      'Full Service': 12000,
      'Normal Service': 9000,
      'Body Wash': 2500,
    },
  },
  {
    categoryName: 'Bus',
    vehicleTypeName: 'Tata Long Bus',
    prices: {
      'Full Service': 16000,
      'Normal Service': 12000,
      'Body Wash': 3500,
    },
  },
  {
    categoryName: 'Bus',
    vehicleTypeName: 'Leyland Bus',
    prices: {
      'Full Service': 16500,
      'Normal Service': 12500,
      'Body Wash': 3500,
    },
  },
  // 6. Lorry
  {
    categoryName: 'Lorry',
    vehicleTypeName: '10 1/2 Lorry',
    prices: {
      'Full Service': 10500,
      'Normal Service': 8000,
      'Body Wash': 2000,
    },
  },
  {
    categoryName: 'Lorry',
    vehicleTypeName: '14 1/2 Lorry',
    prices: {
      'Full Service': 13500,
      'Normal Service': 10000,
      'Body Wash': 2500,
    },
  },
  // 7. Commercial Vehicle
  {
    categoryName: 'Commercial Vehicle',
    vehicleTypeName: 'Demo Batta',
    prices: {
      'Full Service': 6500,
      'Normal Service': 4800,
      'Body Wash': 1200,
    },
  },
  // 8. Tipper
  {
    categoryName: 'Tipper',
    vehicleTypeName: 'Small Tipper',
    prices: {
      'Full Service': 11500,
      'Normal Service': 8500,
      'Body Wash': 2200,
    },
  },
  {
    categoryName: 'Tipper',
    vehicleTypeName: 'Big Tipper',
    prices: {
      'Full Service': 18000,
      'Normal Service': 14000,
      'Body Wash': 4000,
    },
  },
];

async function runServicePricesSeed() {
  console.log(
    '🚀 Initializing database connection for service prices seeding...',
  );
  await AppDataSource.initialize();

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const categoryRepo = queryRunner.manager.getRepository(VehicleCategory);
    const typeRepo = queryRunner.manager.getRepository(VehicleType);
    const serviceRepo = queryRunner.manager.getRepository(Service);
    const servicePriceRepo = queryRunner.manager.getRepository(ServicePrice);

    let upsertedCount = 0;

    for (const item of ALL_VEHICLE_SERVICE_PRICES) {
      let category = await categoryRepo.findOne({
        where: { name: item.categoryName },
      });
      if (!category) {
        category = await categoryRepo.save(
          categoryRepo.create({ name: item.categoryName }),
        );
      }

      let vehicleType = await typeRepo.findOne({
        where: {
          name: item.vehicleTypeName,
          vehicleCategoryId: category.id,
        },
      });
      if (!vehicleType) {
        vehicleType = await typeRepo.save(
          typeRepo.create({
            name: item.vehicleTypeName,
            vehicleCategoryId: category.id,
          }),
        );
      }

      for (const [serviceName, price] of Object.entries(item.prices)) {
        let service = await serviceRepo.findOne({
          where: { name: serviceName },
        });
        if (!service) {
          service = await serviceRepo.save(
            serviceRepo.create({ name: serviceName }),
          );
        }

        await servicePriceRepo.upsert(
          {
            serviceId: service.id,
            vehicleTypeId: vehicleType.id,
            price,
          },
          ['serviceId', 'vehicleTypeId'],
        );
        upsertedCount++;
      }
    }

    await queryRunner.commitTransaction();
    console.log(
      `✅ Successfully seeded ${upsertedCount} service prices across ${ALL_VEHICLE_SERVICE_PRICES.length} vehicle types!`,
    );
  } catch (error) {
    console.error('❌ Service prices seeding failed. Rolling back...', error);
    await queryRunner.rollbackTransaction();
    process.exit(1);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

void runServicePricesSeed();
