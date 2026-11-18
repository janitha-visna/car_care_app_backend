// src/database/seeds/run-mock-test-seed.ts
import { AppDataSource } from '../data-source';
import { VehicleType } from '../../modules/database/vechile-domain-db/vehicle-type.entity';
import { Vehicle } from '../../modules/database/vechile-domain-db/vehicle.entity';
import { Service } from '../../modules/database/service-domain-db/entities/service.entity';
import { ServicePrice } from '../../modules/database/service-domain-db/entities/service-price.entity';
import { Component } from '../../modules/database/part-domain-db/component.entity';
import { MeasurementType } from '../../modules/database/part-domain-db/part-measurement-option.entity';
import { ServiceJob } from '../../modules/database/service-job-domain-db/service-job.entity';
import { ServiceJobDomainService } from '../../modules/database/service-job-domain-db/services/service-job.service';
import { CreateServiceJobDto } from '../../modules/database/service-job-domain-db/dto/create-service-job.dto';

interface MockProductFixture {
  productName: string;
  brandName: string;
  measurementType: MeasurementType;
  quantity: number;
}

interface MockServiceJobFixture {
  numberPlate: string;
  vehicleTypeName: string;
  customerName: string;
  phones: Array<{ number: string; isPrimary: boolean }>;
  jobDate: string;
  meterReading: number;
  nextMeterReading: number;
  servicePackageName: string;
  products: MockProductFixture[];
  extraPartsCost: number;
}

const MOCK_SERVICE_JOBS: MockServiceJobFixture[] = [
  // 1. CAB-1234 — Visit #1 (First-time registration: sends vehicle.id = null, customer.id = null)
  {
    numberPlate: 'CAB-1234',
    vehicleTypeName: 'Regular Car',
    customerName: 'Kasun Perera',
    phones: [
      { number: '0771234567', isPrimary: true },
      { number: '0112345678', isPrimary: false },
    ],
    jobDate: '2026-08-10',
    meterReading: 40000,
    nextMeterReading: 45000,
    servicePackageName: 'Normal Service',
    products: [
      {
        productName: 'Engine Oil',
        brandName: 'Castrol',
        measurementType: MeasurementType.CAN,
        quantity: 1,
      },
      {
        productName: 'Engine Oil Filter',
        brandName: 'Toyota Genuine',
        measurementType: MeasurementType.PIECE,
        quantity: 1,
      },
    ],
    extraPartsCost: 3000,
  },

  // 2. CAB-1234 — Visit #2 (Returning vehicle & customer: reuses existing vehicle.id & customer.id)
  {
    numberPlate: 'CAB-1234',
    vehicleTypeName: 'Regular Car',
    customerName: 'Kasun Perera',
    phones: [
      { number: '0771234567', isPrimary: true },
      { number: '0112345678', isPrimary: false },
    ],
    jobDate: '2026-11-17',
    meterReading: 45000,
    nextMeterReading: 50000,
    servicePackageName: 'Full Service',
    products: [
      {
        productName: 'Engine Oil',
        brandName: 'DS40',
        measurementType: MeasurementType.LOOSE,
        quantity: 3.5,
      },
      {
        productName: 'Air Filter',
        brandName: 'Denso',
        measurementType: MeasurementType.PIECE,
        quantity: 1,
      },
      {
        productName: 'Engine Oil Filter',
        brandName: 'Toyota Genuine',
        measurementType: MeasurementType.PIECE,
        quantity: 1,
      },
    ],
    extraPartsCost: 4500,
  },

  // 3. CAB-1235 — Similar plate prefix to CAB-1234 (for testing /vehicles/lookup suggestions)
  {
    numberPlate: 'CAB-1235',
    vehicleTypeName: 'Regular Car',
    customerName: 'amal Jayasinghe',
    phones: [{ number: '0712233445', isPrimary: true }],
    jobDate: '2026-10-05',
    meterReading: 62000,
    nextMeterReading: 67000,
    servicePackageName: 'Full Service',
    products: [
      {
        productName: 'Engine Oil',
        brandName: 'Mobil',
        measurementType: MeasurementType.CAN,
        quantity: 1,
      },
      {
        productName: 'Fuel Filter',
        brandName: 'Bosch',
        measurementType: MeasurementType.PIECE,
        quantity: 1,
      },
    ],
    extraPartsCost: 3800,
  },

  // 4. CAA-9988 — Small Car
  {
    numberPlate: 'CAA-9988',
    vehicleTypeName: 'Small Car',
    customerName: 'Nimal Silva',
    phones: [{ number: '0719876543', isPrimary: true }],
    jobDate: '2026-11-01',
    meterReading: 28500,
    nextMeterReading: 33500,
    servicePackageName: 'Normal Service',
    products: [
      {
        productName: 'Engine Oil',
        brandName: 'Castrol',
        measurementType: MeasurementType.CAN,
        quantity: 1,
      },
      {
        productName: 'Engine Oil Filter',
        brandName: 'Denso',
        measurementType: MeasurementType.PIECE,
        quantity: 1,
      },
    ],
    extraPartsCost: 2200,
  },

  // 5. DAG-4567 — Double Cab (Visit #1)
  {
    numberPlate: 'DAG-4567',
    vehicleTypeName: 'Double Cab',
    customerName: 'Ruwan Fernando',
    phones: [{ number: '0765554433', isPrimary: true }],
    jobDate: '2026-09-20',
    meterReading: 85000,
    nextMeterReading: 90000,
    servicePackageName: 'Full Service',
    products: [
      {
        productName: 'Engine Oil',
        brandName: 'DS40',
        measurementType: MeasurementType.LOOSE,
        quantity: 6.5,
      },
      {
        productName: 'Fuel Filter',
        brandName: 'Denso',
        measurementType: MeasurementType.PIECE,
        quantity: 1,
      },
      {
        productName: 'Air Filter',
        brandName: 'Bosch',
        measurementType: MeasurementType.PIECE,
        quantity: 1,
      },
    ],
    extraPartsCost: 6500,
  },
];

async function runMockTestSeed() {
  console.log('🚀 Initializing database connection for mock test seeding...');
  await AppDataSource.initialize();

  try {
    const vehicleTypeRepo = AppDataSource.getRepository(VehicleType);
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const serviceRepo = AppDataSource.getRepository(Service);
    const servicePriceRepo = AppDataSource.getRepository(ServicePrice);
    const componentRepo = AppDataSource.getRepository(Component);
    const jobRepo = AppDataSource.getRepository(ServiceJob);

    // -------------------------------------------------------------------------
    // Step 1: Load & Verify Existing Master Data from Database
    // -------------------------------------------------------------------------
    const [vehicleTypes, services, servicePrices, components] =
      await Promise.all([
        vehicleTypeRepo.find(),
        serviceRepo.find(),
        servicePriceRepo.find(),
        componentRepo.find({
          relations: {
            parts: {
              measurementOptions: true,
            },
          },
        }),
      ]);

    if (
      vehicleTypes.length === 0 ||
      services.length === 0 ||
      components.length === 0
    ) {
      throw new Error(
        'Master data is missing! Please run "npm run seed" and "npm run seed:prices" before running "npm run seed:mock".',
      );
    }

    // Build fast lookup maps by natural names
    const vehicleTypeByName = new Map(vehicleTypes.map((vt) => [vt.name, vt]));
    const serviceByName = new Map(services.map((s) => [s.name, s]));
    const priceByServiceAndType = new Map(
      servicePrices.map((sp) => [
        `${sp.serviceId}_${sp.vehicleTypeId}`,
        Number(sp.price),
      ]),
    );
    const componentByName = new Map(components.map((c) => [c.name, c]));

    const serviceJobDomainService = new ServiceJobDomainService(AppDataSource);

    // -------------------------------------------------------------------------
    // Step 2: Process Each Mock Service Job Fixture
    // -------------------------------------------------------------------------
    for (const fixture of MOCK_SERVICE_JOBS) {
      const normalizedPlate = fixture.numberPlate.trim().toUpperCase();

      // Resolve VehicleType
      const vehicleType = vehicleTypeByName.get(fixture.vehicleTypeName);
      if (!vehicleType) {
        throw new Error(
          `VehicleType "${fixture.vehicleTypeName}" not found in database`,
        );
      }

      // Resolve Service Package
      const servicePackage = serviceByName.get(fixture.servicePackageName);
      if (!servicePackage) {
        throw new Error(
          `Service "${fixture.servicePackageName}" not found in database`,
        );
      }

      // Check if this vehicle already exists in DB:
      // - If it does NOT exist yet, we pass id: null (simulating a brand-new registration).
      // - If it ALREADY exists (e.g., 2nd visit of CAB-1234), we pass its existing vehicle.id & customer.id.
      const existingVehicle = await vehicleRepo.findOne({
        where: { numberPlate: normalizedPlate },
      });

      // Skip if this exact mock job (same vehicle + same jobDate) was already seeded
      if (existingVehicle) {
        const existingJob = await jobRepo.findOne({
          where: {
            vehicleId: existingVehicle.id,
            jobDate: new Date(fixture.jobDate),
          },
        });
        if (existingJob) {
          console.log(
            `⏭️  Skipping already seeded job for ${normalizedPlate} on ${fixture.jobDate}`,
          );
          continue;
        }
      }

      // Resolve Products (productId -> brandId -> measurementOptionId) from DB
      const resolvedProducts = fixture.products.map((item) => {
        const component = componentByName.get(item.productName);
        if (!component) {
          throw new Error(`Product "${item.productName}" not found in DB`);
        }

        const part = (component.parts ?? []).find(
          (p) => p.name === item.brandName,
        );
        if (!part) {
          throw new Error(
            `Brand "${item.brandName}" under "${item.productName}" not found in DB`,
          );
        }

        const option = (part.measurementOptions ?? []).find(
          (opt) => opt.type === item.measurementType,
        );
        if (!option) {
          throw new Error(
            `Measurement option "${item.measurementType}" for "${item.productName} - ${item.brandName}" not found in DB`,
          );
        }

        return {
          productId: String(component.id),
          brandId: String(part.id),
          measurementOptionId: String(option.id),
          quantity: item.quantity,
        };
      });

      // Resolve configured service price from DB
      const estimatedServiceCost =
        priceByServiceAndType.get(`${servicePackage.id}_${vehicleType.id}`) ??
        0;
      const totalCost = estimatedServiceCost + fixture.extraPartsCost;

      // Construct the exact payload shape sent by the frontend
      const payload: CreateServiceJobDto = {
        vehicle: {
          id: existingVehicle ? String(existingVehicle.id) : null,
          numberPlate: normalizedPlate,
          vehicleTypeId: String(vehicleType.id),
        },
        customer: {
          id: existingVehicle ? String(existingVehicle.customerId) : null,
          name: fixture.customerName,
          phones: fixture.phones,
        },
        jobDate: fixture.jobDate,
        meterReading: fixture.meterReading,
        nextMeterReading: fixture.nextMeterReading,
        servicePackageId: String(servicePackage.id),
        products: resolvedProducts,
        estimatedCost: estimatedServiceCost,
        totalCost,
      };

      const createdJob =
        await serviceJobDomainService.createServiceJob(payload);
      const visitMode = existingVehicle
        ? `Returning Vehicle (id=${existingVehicle.id})`
        : 'New Registration (id=null)';

      console.log(
        `✅ Seeded Job #${createdJob.id} for ${normalizedPlate} [${visitMode}] on ${fixture.jobDate} — ${fixture.servicePackageName} (Total: Rs.${createdJob.totalCost})`,
      );
    }

    console.log('🎉 All mock service jobs seeded successfully!');
  } catch (error) {
    console.error('❌ Mock test seeding failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

void runMockTestSeed();
