import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { buildTypeOrmConfig } from './config/typeorm.config';
import { VehicleConfigModule } from './modules/vehicle-config/vehicle-config.module';
import { ServiceJobModule } from './modules/database/service-job-domain-db/service-job.module';
import { VehicleModule } from './modules/database/vechile-domain-db/vehicle.module';
import { CustomerModule } from './modules/database/customer-domain-db/customer.module';
import { MeterReadingModule } from './modules/database/meter-domain-db/meter-reading.module';
import { PartModule } from './modules/database/part-domain-db/part.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildTypeOrmConfig,
    }),
    VehicleConfigModule,
    ServiceJobModule,
    VehicleModule,
    CustomerModule,
    MeterReadingModule,
    PartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
