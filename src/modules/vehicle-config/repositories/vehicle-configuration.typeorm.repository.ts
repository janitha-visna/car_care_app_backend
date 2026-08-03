import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { VehicleCategory } from '../entities/vehicle-category.entity';
import { IVehicleConfigurationRepository } from './vehicle-configuration.repository.interface';

@Injectable()
export class VehicleConfigurationTypeOrmRepository
  implements IVehicleConfigurationRepository
{
  constructor(
    @InjectRepository(VehicleCategory)
    private readonly categoryRepository: Repository<VehicleCategory>,
  ) {}

  async findCategoryWithConfiguration(
    categoryId: number,
  ): Promise<VehicleCategory | null> {
    return this.buildConfigurationQuery()
      .andWhere('category.id = :categoryId', { categoryId })
      .getOne();
  }

  async findAllCategoriesWithConfiguration(): Promise<VehicleCategory[]> {
    return this.buildConfigurationQuery().getMany();
  }

  private buildConfigurationQuery(): SelectQueryBuilder<VehicleCategory> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.vehicleTypes', 'vehicleType')
      .leftJoinAndSelect('vehicleType.availableServices', 'availableService')
      .leftJoinAndSelect('availableService.serviceType', 'serviceType')
      .leftJoinAndSelect('availableService.serviceOption', 'serviceOption')
      .orderBy('category.name', 'ASC')
      .addOrderBy('vehicleType.name', 'ASC')
      .addOrderBy('serviceType.name', 'ASC')
      .addOrderBy('serviceOption.name', 'ASC');
  }
}
