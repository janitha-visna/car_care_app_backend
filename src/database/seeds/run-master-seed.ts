// src/database/seeds/run-master-seed.ts
import { Not, In } from 'typeorm';
import { AppDataSource } from '../data-source';
import { VehicleCategory } from '../../modules/database/vechile-domain-db/vehicle-category.entity';
import { VehicleType } from '../../modules/database/vechile-domain-db/vehicle-type.entity';
import { Component } from '../../modules/database/part-domain-db/component.entity';
import { Part } from '../../modules/database/part-domain-db/part.entity';
import { PartMeasurementOption } from '../../modules/database/part-domain-db/part-measurement-option.entity';
import { Service } from '../../modules/database/service-domain-db/entities/service.entity';
import {
  VEHICLE_CATEGORIES_DATA,
  COMPONENTS_AND_PARTS_DATA,
  SERVICES_DATA,
} from './initial-master-data';

async function runSeed() {
  console.log('🚀 Initializing database connection for seeding...');
  await AppDataSource.initialize();

  console.log('🔄 Synchronizing database schema...');
  await AppDataSource.synchronize();

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const categoryRepo = queryRunner.manager.getRepository(VehicleCategory);
    const typeRepo = queryRunner.manager.getRepository(VehicleType);
    const componentRepo = queryRunner.manager.getRepository(Component);
    const partRepo = queryRunner.manager.getRepository(Part);
    const measurementOptionRepo = queryRunner.manager.getRepository(
      PartMeasurementOption,
    );
    const serviceRepo = queryRunner.manager.getRepository(Service);

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
    // 2. Seed Components, Parts & Measurement Options
    // -------------------------------------------------------------------------
    console.log('🔧 Seeding Components, Parts & Measurement Options...');

    for (const compData of COMPONENTS_AND_PARTS_DATA) {
      let component = await componentRepo.findOne({
        where: { name: compData.componentName },
      });
      if (!component) {
        component = await componentRepo.save(
          componentRepo.create({ name: compData.componentName }),
        );
      }

      const validPartNames = compData.parts.map((p) => p.name);
      if (validPartNames.length > 0) {
        await partRepo.delete({
          componentId: component.id,
          name: Not(In(validPartNames)),
        });
      }

      for (const pData of compData.parts) {
        let part = await partRepo.findOne({
          where: { componentId: component.id, name: pData.name },
        });

        if (!part) {
          part = await partRepo.save(
            partRepo.create({
              name: pData.name,
              componentId: component.id,
            }),
          );
        }

        for (const optData of pData.measurementOptions) {
          const existingOption = await measurementOptionRepo.findOne({
            where: {
              partId: part.id,
              type: optData.type,
              unit: optData.unit,
            },
          });

          if (!existingOption) {
            await measurementOptionRepo.save(
              measurementOptionRepo.create({
                partId: part.id,
                type: optData.type,
                unit: optData.unit,
                allowDecimal: optData.allowDecimal,
              }),
            );
          } else if (existingOption.allowDecimal !== optData.allowDecimal) {
            existingOption.allowDecimal = optData.allowDecimal;
            await measurementOptionRepo.save(existingOption);
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // 3. Seed Services (Full Service, Normal Service, Body Wash)
    // -------------------------------------------------------------------------
    console.log('🛠️ Seeding Services...');
    for (const sData of SERVICES_DATA) {
      const service = await serviceRepo.findOne({
        where: { name: sData.name },
      });
      if (!service) {
        await serviceRepo.save(
          serviceRepo.create({
            name: sData.name,
          }),
        );
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
