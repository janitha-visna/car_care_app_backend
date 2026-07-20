import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
    return this.buildConfigurationQuery()
      .andWhere('category.id = :categoryId', { categoryId })
      .getOne();
  }

  async findAllActiveCategoriesWithConfiguration(): Promise<VehicleCategory[]> {
    return this.buildConfigurationQuery()
      .orderBy('category.name', 'ASC')
      .addOrderBy('vehicleType.sortOrder', 'ASC')
      .addOrderBy('mapping.sortOrder', 'ASC')
      .addOrderBy('option.sortOrder', 'ASC')
      .getMany();
  }

  /**
   * Shared join chain: category -> active vehicle types -> active service
   * mappings -> active service types -> active options. Kept in one place
   * so the single-category and all-categories queries can't drift apart.
   */
  private buildConfigurationQuery(): SelectQueryBuilder<VehicleCategory> {
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
      .where('category.isActive = :active', { active: true })
      .orderBy('vehicleType.sortOrder', 'ASC')
      .addOrderBy('mapping.sortOrder', 'ASC')
      .addOrderBy('option.sortOrder', 'ASC');
  }
}
