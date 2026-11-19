// src/database/seeds/run-faker-seed.ts
import { faker } from '@faker-js/faker';
import { PRICES_DATA, PriceService, PriceVehicleType } from './prices';
import {
  PRODUCTS_DATA,
  ProductComponent,
  ProductMeasurementOption,
  ProductPart,
} from './products';

/**
 * Shape of a single product item inside a mock service job payload.
 */
export interface MockServiceJobProduct {
  productId: number;
  brandId: number;
  measurementOptionId: number;
  quantity: number;
  supplySource: 'SHOP_SUPPLIED' | 'CUSTOMER_SUPPLIED';
}

/**
 * Shape of a customer phone entry inside a mock service job payload.
 */
export interface MockCustomerPhone {
  number: string;
  isPrimary: boolean;
}

/**
 * Full mock service job payload matching the create-service-job API format.
 */
export interface MockServiceJobPayload {
  vehicle: {
    id: null;
    numberPlate: string;
    vehicleTypeId: number;
  };
  customer: {
    id: null;
    name: string;
    phones: MockCustomerPhone[];
  };
  jobDate: string;
  meterReading: number;
  nextMeterReading: number;
  servicePackageId: number;
  products: MockServiceJobProduct[];
  estimatedCost: number;
  totalCost: number;
}

// Allowed vehicle number plate prefixes (no spaces)
const PLATE_PREFIXES = [
  'CAB',
  'CAA',
  'CBA',
  'DAG',
  'KDH',
  'NB',
  'WPA',
] as const;

// Number of mock service jobs to generate for each calendar day in 2026
const JOBS_PER_DAY = 2;

// Number of products (components) to randomly pick per service job
const PRODUCTS_PER_JOB = 2;

/**
 * Generates a randomized Sri Lankan style number plate without spaces (e.g. "CAB-1234").
 */
function generateNumberPlate(): string {
  const prefix = faker.helpers.arrayElement(PLATE_PREFIXES);
  const digits = faker.string.numeric(4);
  return `${prefix}-${digits}`;
}

/**
 * Generates at least 2 randomized phone numbers for a customer.
 * The first number is always marked as primary (`isPrimary: true`),
 * and all additional numbers are marked as secondary (`isPrimary: false`).
 */
function generateCustomerPhones(): MockCustomerPhone[] {
  const phoneCount = faker.number.int({ min: 2, max: 3 });

  return Array.from({ length: phoneCount }, (_, index) => ({
    // Generates a 10-digit Sri Lankan mobile number starting with 07x
    number: faker.helpers.fromRegExp(/07[0125678][0-9]{7}/),
    isPrimary: index === 0,
  }));
}

/**
 * Picks 2 random components from PRODUCTS_DATA, then selects a random part (brand)
 * and measurement option for each component, and calculates a valid quantity.
 */
function generateJobProducts(
  validComponents: ProductComponent[],
): MockServiceJobProduct[] {
  // Randomly select 2 distinct components (e.g. "Air Filter" and "Engine Oil")
  const selectedComponents = faker.helpers.arrayElements(
    validComponents,
    Math.min(PRODUCTS_PER_JOB, validComponents.length),
  );

  return selectedComponents.map((component: ProductComponent) => {
    // Filter parts under this component that have at least one measurement option
    const validParts = component.parts.filter(
      (part) => part.measurementOptions.length > 0,
    );

    // Pick one random brand/part belonging to the selected component
    const chosenPart: ProductPart = faker.helpers.arrayElement(validParts);

    // Pick one random measurement option belonging to the selected part
    const chosenOption: ProductMeasurementOption = faker.helpers.arrayElement(
      chosenPart.measurementOptions,
    );

    // Quantity rules:
    // - When allowDecimal is true (e.g. loose litres), pick a decimal between 1 and 10 (e.g. 3.5)
    // - When allowDecimal is false (e.g. pieces/cans), pick a whole number between 1 and 3
    const quantity = chosenOption.allowDecimal
      ? faker.number.float({ min: 1, max: 10, multipleOf: 0.5 })
      : faker.number.int({ min: 1, max: 3 });

    return {
      productId: Number(component.id),
      brandId: Number(chosenPart.id),
      measurementOptionId: Number(chosenOption.id),
      quantity,
      supplySource: faker.helpers.arrayElement([
        'SHOP_SUPPLIED',
        'CUSTOMER_SUPPLIED',
      ] as const),
    };
  });
}

/**
 * Generates mock service jobs for every single day from 2026-01-01 to 2026-12-31
 * (2 jobs per day) using local static master data (`prices.ts` and `products.ts`)
 * without connecting to any database.
 */
export function generateMockServiceJobs(): MockServiceJobPayload[] {
  // 1. Flatten all vehicleTypes across every category in prices.ts into one array
  const allVehicleTypes: PriceVehicleType[] = PRICES_DATA.categories.flatMap(
    (category) => category.vehicleTypes,
  );

  // 2. Read all service packages from prices.ts (e.g. Full Service, Normal Service, Body Wash)
  const allServices: PriceService[] = PRICES_DATA.services;

  // 3. Keep only components from products.ts that have at least one part with measurement options
  const validComponents: ProductComponent[] = PRODUCTS_DATA.filter(
    (component) =>
      component.parts.some((part) => part.measurementOptions.length > 0),
  );

  if (
    allVehicleTypes.length === 0 ||
    allServices.length === 0 ||
    validComponents.length === 0
  ) {
    throw new Error(
      'Static seed data in prices.ts or products.ts is incomplete.',
    );
  }

  const mockJobs: MockServiceJobPayload[] = [];

  // 4. Set the date range in UTC so timezone offsets never shift the calendar date
  const startDate = new Date(Date.UTC(2026, 0, 1)); // 2026-01-01
  const endDate = new Date(Date.UTC(2026, 11, 31)); // 2026-12-31

  // 5. Loop through every day of 2026, one day at a time
  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setUTCDate(currentDate.getUTCDate() + 1)
  ) {
    // Format date as "YYYY-MM-DD" (e.g. "2026-11-17")
    const jobDate = currentDate.toISOString().split('T')[0];

    // Generate 2 mock jobs for this specific day
    for (let jobIndex = 0; jobIndex < JOBS_PER_DAY; jobIndex++) {
      // Pick a random vehicle type from prices.ts
      const chosenVehicleType = faker.helpers.arrayElement(allVehicleTypes);

      // Pick a random service package from prices.ts
      const chosenService = faker.helpers.arrayElement(allServices);

      // Generate current odometer reading (multiple of 500) and next service due (+5000 km)
      const meterReading = faker.number.int({
        min: 10000,
        max: 150000,
        multipleOf: 500,
      });
      const nextMeterReading = meterReading + 5000;

      // Look up the exact base price using "<serviceId>_<vehicleTypeId>" from prices.ts
      const priceKey = `${chosenService.id}_${chosenVehicleType.id}`;
      const estimatedCost = PRICES_DATA.prices[priceKey] ?? 0;

      // Total cost is always higher than estimatedCost by adding 1000 to 2500
      const extraCost = faker.number.int({
        min: 1000,
        max: 2500,
        multipleOf: 100,
      });
      const totalCost = estimatedCost + extraCost;

      // Build the final mock job object matching the expected payload shape
      const mockJob: MockServiceJobPayload = {
        vehicle: {
          id: null,
          numberPlate: generateNumberPlate(),
          vehicleTypeId: Number(chosenVehicleType.id),
        },
        customer: {
          id: null,
          name: faker.person.fullName(),
          phones: generateCustomerPhones(),
        },
        jobDate,
        meterReading,
        nextMeterReading,
        servicePackageId: Number(chosenService.id),
        products: generateJobProducts(validComponents),
        estimatedCost,
        totalCost,
      };

      mockJobs.push(mockJob);
    }
  }

  return mockJobs;
}

/**
 * Entry point when running `npm run seed:faker`.
 * Generates all 2026 mock jobs and POSTs each one to `POST /service-jobs`.
 */
async function runFakerSeed(): Promise<void> {
  const apiUrl = process.env.API_URL ?? 'http://localhost:3000';
  const endpoint = `${apiUrl}/service-jobs`;

  console.log(
    '🚀 Generating Faker mock service jobs for all of 2026...',
  );

  const mockJobs = generateMockServiceJobs();

  console.log(`✅ Generated ${mockJobs.length} mock service jobs.`);
  console.log(
    `📅 Date range: ${mockJobs[0]?.jobDate} -> ${mockJobs[mockJobs.length - 1]?.jobDate}`,
  );
  console.log(`📤 Sending jobs to ${endpoint}...`);

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < mockJobs.length; i++) {
    const job = mockJobs[i];
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });

      if (!response.ok) {
        failureCount++;
        const errText = await response.text();
        console.error(
          `❌ Job ${i + 1}/${mockJobs.length} (${job.jobDate}) failed [${response.status}]: ${errText}`,
        );
      } else {
        successCount++;
      }
    } catch (error) {
      failureCount++;
      console.error(
        `❌ Job ${i + 1}/${mockJobs.length} (${job.jobDate}) network error:`,
        error instanceof Error ? error.message : error,
      );
    }

    if ((i + 1) % 100 === 0 || i === mockJobs.length - 1) {
      console.log(
        `⏳ Progress: ${i + 1}/${mockJobs.length} (✅ ${successCount}, ❌ ${failureCount})`,
      );
    }
  }

  console.log(
    `🎉 Faker seeding finished! Inserted: ${successCount}, Failed: ${failureCount}`,
  );
}

void runFakerSeed();
