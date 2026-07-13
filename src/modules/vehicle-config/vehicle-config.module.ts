import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleCategory } from './entities/vehicle-category.entity';
import { VehicleType } from './entities/vehicle-type.entity';
import { ServiceType } from './entities/service-type.entity';
import { ServiceOption } from './entities/service-option.entity';
import { VehicleServiceMapping } from './entities/vehicle-service-mapping.entity';
import { ConfigurationController } from './controllers/configuration.controller';
import { ConfigurationQueryService } from './services/configuration-query.service';
import { ConfigurationMapper } from './mappers/configuration.mapper';
import { VehicleConfigurationTypeOrmRepository } from './repositories/vehicle-configuration.typeorm.repository';
import { VEHICLE_CONFIGURATION_REPOSITORY } from './repositories/vehicle-configuration.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleCategory,
      VehicleType,
      ServiceType,
      ServiceOption,
      VehicleServiceMapping,
    ]),
  ],
  controllers: [ConfigurationController],
  providers: [
    ConfigurationQueryService,
    ConfigurationMapper,
    {
      provide: VEHICLE_CONFIGURATION_REPOSITORY,
      useClass: VehicleConfigurationTypeOrmRepository,
    },
  ],
})
export class VehicleConfigModule {}
