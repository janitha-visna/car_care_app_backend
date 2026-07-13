import { DataSource } from 'typeorm';
import { VehicleCategory } from '../../modules/vehicle-config/entities/vehicle-category.entity';
import { VehicleType } from '../../modules/vehicle-config/entities/vehicle-type.entity';
import { ServiceType } from '../../modules/vehicle-config/entities/service-type.entity';
import { ServiceOption } from '../../modules/vehicle-config/entities/service-option.entity';
import { VehicleServiceMapping } from '../../modules/vehicle-config/entities/vehicle-service-mapping.entity';
import {
  SERVICE_OPTION_NAMES,
  SERVICE_TYPE_NAMES,
  VEHICLE_CATEGORY_SEEDS,
} from './vehicle-config.seed-data';

/**
 * Idempotent: safe to re-run. Each entity is looked up by its natural
 * unique key first (find-or-create) instead of blindly inserting, so
 * running this against a database that already has some of the data
 * (e.g. after adding a new category to the seed file) only inserts what's
 * missing rather than erroring on the unique constraints or duplicating rows.
 */
export async function seedVehicleConfiguration(
  dataSource: DataSource,
): Promise<void> {
  const categoryRepo = dataSource.getRepository(VehicleCategory);
  const typeRepo = dataSource.getRepository(VehicleType);
  const serviceTypeRepo = dataSource.getRepository(ServiceType);
  const optionRepo = dataSource.getRepository(ServiceOption);
  const mappingRepo = dataSource.getRepository(VehicleServiceMapping);

  // 1. Service types (Body Wash, Normal Service, Full Service)
  const serviceTypeByName = new Map<string, ServiceType>();
  for (const [index, name] of SERVICE_TYPE_NAMES.entries()) {
    let serviceType = await serviceTypeRepo.findOneBy({ name });
    serviceType ??= await serviceTypeRepo.save(
      serviceTypeRepo.create({ name, sortOrder: index }),
    );
    serviceTypeByName.set(name, serviceType);
  }

  // 2. Service options — same catalog under each service type, since the
  // requirement states every service type supports these configurable items.
  for (const serviceType of serviceTypeByName.values()) {
    for (const [index, name] of SERVICE_OPTION_NAMES.entries()) {
      const existing = await optionRepo.findOneBy({
        serviceTypeId: serviceType.id,
        name,
      });
      if (!existing) {
        await optionRepo.save(
          optionRepo.create({
            serviceTypeId: serviceType.id,
            name,
            required: false,
            sortOrder: index,
          }),
        );
      }
    }
  }

  // 3. Vehicle categories, subcategories (VehicleType rows), and the
  // service mappings that say which services each subcategory supports.
  for (const categorySeed of VEHICLE_CATEGORY_SEEDS) {
    let category = await categoryRepo.findOneBy({
      name: categorySeed.category,
    });
    category ??= await categoryRepo.save(
      categoryRepo.create({ name: categorySeed.category }),
    );

    for (const [
      typeIndex,
      subcategoryName,
    ] of categorySeed.subcategories.entries()) {
      let vehicleType = await typeRepo.findOneBy({
        categoryId: category.id,
        name: subcategoryName,
      });
      vehicleType ??= await typeRepo.save(
        typeRepo.create({
          categoryId: category.id,
          name: subcategoryName,
          sortOrder: typeIndex,
        }),
      );

      for (const [
        mappingIndex,
        serviceName,
      ] of categorySeed.supportedServices.entries()) {
        const serviceType = serviceTypeByName.get(serviceName);
        if (!serviceType) {
          continue;
        }

        const existingMapping = await mappingRepo.findOneBy({
          vehicleTypeId: vehicleType.id,
          serviceTypeId: serviceType.id,
        });
        if (!existingMapping) {
          await mappingRepo.save(
            mappingRepo.create({
              vehicleTypeId: vehicleType.id,
              serviceTypeId: serviceType.id,
              sortOrder: mappingIndex,
            }),
          );
        }
      }
    }
  }
}
