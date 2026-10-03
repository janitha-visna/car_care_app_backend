import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { buildTypeOrmConfig } from './config/typeorm.config';
import { VehicleConfigModule } from './modules/vehicle-config/vehicle-config.module';
import { ServiceJobModule } from './modules/database/service-job-domain-db/service-job.module';
import { VehicleModule } from './modules/database/vechile-domain-db/vehicle.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
