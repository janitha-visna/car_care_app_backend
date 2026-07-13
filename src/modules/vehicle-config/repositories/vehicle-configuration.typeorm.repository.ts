import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleCategory } from '../entities/vehicle-category.entity';
import { IVehicleConfigurationRepository } from './vehicle-configuration.repository.interface';

/**
 * TypeORM-backed implementation. Uses a single query with joined relations
 * so the controller makes one round trip to the DB and the frontend makes
 * one round trip to the API — no N+1 fan-out per vehicle type/service.
 */
@Injectable()
export class VehicleConfigurationTypeOrmRepository implements IVehicleConfigurationRepository {
  constructor(
    @InjectRepository(VehicleCategory)
    private readonly categoryRepository: Repository<VehicleCategory>,
  ) {}

  async findActiveCategoryWithConfiguration(
    categoryId: number,
  ): Promise<VehicleCategory | null> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect(
        'category.vehicleTypes',
        'vehicleType',
        'vehicleType.isActive = :active',
        { active: true },
      )
      .leftJoinAndSelect(
        'vehicleType.serviceMappings',
        'mapping',
        'mapping.isActive = :active',
        { active: true },
      )
      .leftJoinAndSelect(
        'mapping.serviceType',
        'serviceType',
        'serviceType.isActive = :active',
        { active: true },
      )
      .leftJoinAndSelect(
        'serviceType.options',
        'option',
        'option.isActive = :active',
        { active: true },
      )
      .where('category.id = :categoryId', { categoryId })
      .andWhere('category.isActive = :active', { active: true })
      .orderBy('vehicleType.sortOrder', 'ASC')
      .addOrderBy('mapping.sortOrder', 'ASC')
      .addOrderBy('option.sortOrder', 'ASC')
      .getOne();
  }
}
