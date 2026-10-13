// src/database/seeds/run-master-seed.ts
import { AppDataSource } from '../data-source';
import { VehicleCategory } from '../../modules/database/vechile-domain-db/vehicle-category.entity';
import { VehicleType } from '../../modules/database/vechile-domain-db/vehicle-type.entity';
import { Component } from '../../modules/database/part-domain-db/component.entity';
import { Part } from '../../modules/database/part-domain-db/part.entity';
import { Service } from '../../modules/database/service-domain-db/service.entity';
import { ServiceComponent } from '../../modules/database/service-domain-db/service-component.entity';
import {
  VEHICLE_CATEGORIES_DATA,
  COMPONENTS_AND_PARTS_DATA,
  SERVICES_DATA,
} from './initial-master-data';

async function runSeed() {
  console.log('🚀 Initializing database connection for seeding...');
  await AppDataSource.initialize();

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const categoryRepo = queryRunner.manager.getRepository(VehicleCategory);
    const typeRepo = queryRunner.manager.getRepository(VehicleType);
    const componentRepo = queryRunner.manager.getRepository(Component);
    const partRepo = queryRunner.manager.getRepository(Part);
    const serviceRepo = queryRunner.manager.getRepository(Service);
    const serviceCompRepo = queryRunner.manager.getRepository(ServiceComponent);

    // -------------------------------------------------------------------------
    // 1. Seed Categories & Vehicle Types
    // -------------------------------------------------------------------------
    console.log('📦 Seeding Vehicle Categories & Types...');
    for (const catData of VEHICLE_CATEGORIES_DATA) {
      let category = await categoryRepo.findOne({
        where: { name: catData.name },
      });
      if (!category) {
        category = await categoryRepo.save(
          categoryRepo.create({ name: catData.name }),
        );
      }

      for (const typeData of catData.types) {
        const existingType = await typeRepo.findOne({
          where: { name: typeData.name, vehicleCategoryId: category.id },
        });
        if (!existingType) {
          await typeRepo.save(
            typeRepo.create({
              name: typeData.name,
              description: typeData.description,
              vehicleCategoryId: category.id,
            }),
          );
        }
      }
    }

    // -------------------------------------------------------------------------
    // 2. Seed Components & Parts
    // -------------------------------------------------------------------------
    console.log('🔧 Seeding Components & Parts...');
    const componentMap = new Map<string, Component>();

    for (const compData of COMPONENTS_AND_PARTS_DATA) {
      let component = await componentRepo.findOne({
        where: { name: compData.componentName },
      });
      if (!component) {
        component = await componentRepo.save(
          componentRepo.create({ name: compData.componentName }),
        );
      }
      componentMap.set(component.name, component);

      for (const pData of compData.parts) {
        const existingPart = await partRepo.findOne({
          where: { partNumber: pData.partNumber },
        });
        if (!existingPart) {
          await partRepo.save(
            partRepo.create({
              partNumber: pData.partNumber,
              brand: pData.brand,
              name: pData.name,
              componentId: component.id,
            }),
          );
        }
      }
    }

    // -------------------------------------------------------------------------
    // 3. Seed Services & Service-Component Mappings
    // -------------------------------------------------------------------------
    console.log('🛠️ Seeding Services & Required Components...');
    for (const sData of SERVICES_DATA) {
      let service = await serviceRepo.findOne({ where: { name: sData.name } });
      if (!service) {
        service = await serviceRepo.save(
          serviceRepo.create({
            name: sData.name,
            basePrice: sData.basePrice,
          }),
        );
      }

      for (const reqCompName of sData.requiredComponents) {
        const comp = componentMap.get(reqCompName);
        if (comp) {
          const existingMapping = await serviceCompRepo.findOne({
            where: { serviceId: service.id, componentId: comp.id },
          });
          if (!existingMapping) {
            await serviceCompRepo.save(
              serviceCompRepo.create({
                serviceId: service.id,
                componentId: comp.id,
              }),
            );
          }
        }
      }
    }

    await queryRunner.commitTransaction();
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed. Rolling back transaction...', error);
    await queryRunner.rollbackTransaction();
    process.exit(1);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

void runSeed();
