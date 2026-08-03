import { DataSource } from 'typeorm';
import { ServiceOption } from '../../modules/vehicle-config/entities/service-option.entity';
import { ServiceType } from '../../modules/vehicle-config/entities/service-type.entity';
import { VehicleAvailableService } from '../../modules/vehicle-config/entities/vehicle-available-service.entity';
import { VehicleCategory } from '../../modules/vehicle-config/entities/vehicle-category.entity';
import { VehicleType } from '../../modules/vehicle-config/entities/vehicle-type.entity';
import {
  SERVICE_OPTION_NAMES,
  SERVICE_TYPE_NAMES,
  VEHICLE_CATEGORY_SEEDS,
} from './vehicle-config.seed-data';

/**
 * Idempotent seed for the vehicle configuration catalog and availability rows.
 */
export async function seedVehicleConfiguration(
  dataSource: DataSource,
): Promise<void> {
  const categoryRepo = dataSource.getRepository(VehicleCategory);
  const typeRepo = dataSource.getRepository(VehicleType);
  const serviceTypeRepo = dataSource.getRepository(ServiceType);
  const optionRepo = dataSource.getRepository(ServiceOption);
  const availabilityRepo = dataSource.getRepository(VehicleAvailableService);

  const serviceTypeByName = new Map<string, ServiceType>();
  for (const name of SERVICE_TYPE_NAMES) {
    let serviceType = await serviceTypeRepo.findOneBy({ name });
    serviceType ??= await serviceTypeRepo.save(
      serviceTypeRepo.create({ name }),
    );
    serviceTypeByName.set(name, serviceType);
  }

  const serviceOptionByName = new Map<string, ServiceOption>();
  for (const name of SERVICE_OPTION_NAMES) {
    let serviceOption = await optionRepo.findOneBy({ name });
    serviceOption ??= await optionRepo.save(
      optionRepo.create({ name }),
    );
    serviceOptionByName.set(name, serviceOption);
  }
  for (const categorySeed of VEHICLE_CATEGORY_SEEDS) {
    let category = await categoryRepo.findOneBy({
      name: categorySeed.category,
    });
    category ??= await categoryRepo.save(
      categoryRepo.create({ name: categorySeed.category }),
    );

    for (const vehicleTypeSeed of categorySeed.vehicleTypes) {
      let vehicleType = await typeRepo.findOneBy({
        vehicleCategoryId: category.id,
        name: vehicleTypeSeed.name,
      });
      vehicleType ??= await typeRepo.save(
        typeRepo.create({
          vehicleCategoryId: category.id,
          name: vehicleTypeSeed.name,
        }),
      );

      for (const availableService of vehicleTypeSeed.services) {
        const serviceType = serviceTypeByName.get(
          availableService.serviceType,
        );
        if (!serviceType) {
          continue;
        }

        for (const serviceOptionName of availableService.serviceOptions) {
          const serviceOption = serviceOptionByName.get(serviceOptionName);
          if (!serviceOption) {
            continue;
          }

          const existingAvailability = await availabilityRepo.findOneBy({
            vehicleTypeId: vehicleType.id,
            serviceTypeId: serviceType.id,
            serviceOptionId: serviceOption.id,
          });

          if (!existingAvailability) {
            await availabilityRepo.save(
              availabilityRepo.create({
                vehicleTypeId: vehicleType.id,
                serviceTypeId: serviceType.id,
                serviceOptionId: serviceOption.id,
              }),
            );
          }
        }
      }
    }
  }
}
