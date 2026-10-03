import 'dotenv/config';
import { DataSource } from 'typeorm';
import { VehicleCategory } from '../modules/vehicle-config/entities/vehicle-category.entity';
import { VehicleType } from '../modules/vehicle-config/entities/vehicle-type.entity';
import { ServiceType } from '../modules/vehicle-config/entities/service-type.entity';
import { ServiceOption } from '../modules/vehicle-config/entities/service-option.entity';
import { VehicleServiceMapping } from '../modules/vehicle-config/entities/vehicle-service-mapping.entity';
import { ServiceJob } from '../modules/database/service-job-domain-db/service-job.entity';
import { ServiceJobService } from '../modules/database/service-job-domain-db/service-job-service.entity';
import { Vehicle } from '../modules/database/vechile-domain-db/vehicle.entity';
import { Customer } from '../modules/database/customer-domain-db/customer.entity';
import { CustomerPhoneNumber } from '../modules/database/customer-domain-db/customer-phone-number.entity';
import { MeterReading } from '../modules/database/meter-domain-db/meter-reading.entity';

/**
 * Standalone DataSource for CLI usage (seeding, future migrations) — kept
 * separate from Nest's TypeOrmModule bootstrap since seed scripts run
 * outside the Nest application context.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'car_care',
  entities: [
    VehicleCategory,
    VehicleType,
    ServiceType,
    ServiceOption,
    VehicleServiceMapping,
    ServiceJob,
    ServiceJobService,
    Vehicle,
    Customer,
    CustomerPhoneNumber,
    MeterReading,
  ],
  synchronize: false,
});
