import { AppDataSource } from '../data-source';
import { seedVehicleConfiguration } from './vehicle-config.seed';

async function run(): Promise<void> {
  await AppDataSource.initialize();
  try {
    await seedVehicleConfiguration(AppDataSource);

    console.log('Vehicle configuration seed completed.');
  } finally {
    await AppDataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Vehicle configuration seed failed:', error);
  process.exitCode = 1;
});
