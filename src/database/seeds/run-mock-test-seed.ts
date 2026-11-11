// src/database/seeds/run-mock-test-seed.ts
import { AppDataSource } from '../data-source';
import { VehicleCategory } from '../../modules/database/vechile-domain-db/vehicle-category.entity';
import { VehicleType } from '../../modules/database/vechile-domain-db/vehicle-type.entity';
import { Vehicle } from '../../modules/database/vechile-domain-db/vehicle.entity';
import { Customer } from '../../modules/database/customer-domain-db/customer.entity';
import { CustomerPhoneNumber } from '../../modules/database/customer-domain-db/customer-phone-number.entity';
import { Service } from '../../modules/database/service-domain-db/entities/service.entity';
import { ServicePrice } from '../../modules/database/service-domain-db/entities/service-price.entity';

interface MockVehicleFixture {
  numberPlate: string;
  categoryName: string;
  vehicleTypeName: string;
  customerName: string;
  phoneNumbers: Array<{ phoneNumber: string; isPrimary: boolean }>;
  servicePrices: Record<string, number>;
}

const MOCK_VEHICLES: MockVehicleFixture[] = [
  {
    numberPlate: 'CAB-1234',
    categoryName: 'Car',
    vehicleTypeName: 'Regular Car',
    customerName: 'Kasun Perera',
    phoneNumbers: [
      { phoneNumber: '0771234567', isPrimary: true },
      { phoneNumber: '0112345678', isPrimary: false },
    ],
    servicePrices: {
      'Full Service': 6000,
      'Normal Service': 5500,
      'Body Wash': 1000,
    },
  },
  {
    numberPlate: 'CAA-9988',
    categoryName: 'Car',
    vehicleTypeName: 'Small Car',
    customerName: 'Nimal Silva',
    phoneNumbers: [{ phoneNumber: '0719876543', isPrimary: true }],
    servicePrices: {
      'Full Service': 4500,
      'Normal Service': 3500,
      'Body Wash': 800,
    },
  },
  {
    numberPlate: 'DAG-4567',
    categoryName: 'Cab',
    vehicleTypeName: 'Double Cab',
    customerName: 'Ruwan Fernando',
    phoneNumbers: [{ phoneNumber: '0765554433', isPrimary: true }],
    servicePrices: {
      'Full Service': 8500,
      'Normal Service': 6500,
      'Body Wash': 1500,
    },
  },
];

async function runMockTestSeed() {
  console.log('🚀 Initializing database connection for mock test seeding...');
  await AppDataSource.initialize();

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const categoryRepo = queryRunner.manager.getRepository(VehicleCategory);
    const typeRepo = queryRunner.manager.getRepository(VehicleType);
    const vehicleRepo = queryRunner.manager.getRepository(Vehicle);
    const customerRepo = queryRunner.manager.getRepository(Customer);
    const phoneRepo = queryRunner.manager.getRepository(CustomerPhoneNumber);
    const serviceRepo = queryRunner.manager.getRepository(Service);
    const servicePriceRepo = queryRunner.manager.getRepository(ServicePrice);

    for (const item of MOCK_VEHICLES) {
      // 1. Ensure Category & Vehicle Type exist
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

      // 2. Upsert Service Prices for this Vehicle Type
      for (const [serviceName, price] of Object.entries(item.servicePrices)) {
        let service = await serviceRepo.findOne({
          where: { name: serviceName },
        });
        if (!service) {
          service = await serviceRepo.save(
            serviceRepo.create({ name: serviceName }),
          );
        }

        const existingPrice = await servicePriceRepo.findOne({
          where: {
            serviceId: service.id,
            vehicleTypeId: vehicleType.id,
          },
        });

        if (existingPrice) {
          existingPrice.price = price;
          await servicePriceRepo.save(existingPrice);
        } else {
          await servicePriceRepo.save(
            servicePriceRepo.create({
              serviceId: service.id,
              vehicleTypeId: vehicleType.id,
              price,
            }),
          );
        }
      }

      // 3. Upsert Customer, Phone Numbers & Vehicle by Number Plate
      const normalizedPlate = item.numberPlate.trim().toUpperCase();
      let existingVehicle = await vehicleRepo.findOne({
        where: { numberPlate: normalizedPlate },
        relations: { customer: true },
      });

      if (!existingVehicle) {
        const customer = await customerRepo.save(
          customerRepo.create({ name: item.customerName }),
        );

        for (const p of item.phoneNumbers) {
          await phoneRepo.save(
            phoneRepo.create({
              customerId: customer.id,
              phoneNumber: p.phoneNumber,
              isPrimary: p.isPrimary,
            }),
          );
        }

        existingVehicle = await vehicleRepo.save(
          vehicleRepo.create({
            numberPlate: normalizedPlate,
            customerId: customer.id,
            vehicleTypeId: vehicleType.id,
          }),
        );
        console.log(
          `✅ Created mock vehicle ${normalizedPlate} (${item.vehicleTypeName}) for customer ${item.customerName}`,
        );
      } else {
        existingVehicle.vehicleTypeId = vehicleType.id;
        await vehicleRepo.save(existingVehicle);
        console.log(
          `🔄 Updated existing mock vehicle ${normalizedPlate} (${item.vehicleTypeName})`,
        );
      }
    }

    await queryRunner.commitTransaction();
    console.log('🎉 Mock test data seeded successfully!');
  } catch (error) {
    console.error('❌ Mock test seeding failed. Rolling back...', error);
    await queryRunner.rollbackTransaction();
    process.exit(1);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

void runMockTestSeed();
