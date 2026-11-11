import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ServicePrice } from '../entities/service-price.entity';
import { Service } from '../entities/service.entity';
import { VehicleCategory } from '../../vechile-domain-db/vehicle-category.entity';
import { VehicleType } from '../../vechile-domain-db/vehicle-type.entity';
import { SaveServicePricesDto } from '../dto/save-service-prices.dto';

@Injectable()
export class ServicePriceService {
  constructor(
    @InjectRepository(ServicePrice)
    private readonly servicePriceRepo: Repository<ServicePrice>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(VehicleCategory)
    private readonly categoryRepo: Repository<VehicleCategory>,
    @InjectRepository(VehicleType)
    private readonly vehicleTypeRepo: Repository<VehicleType>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Fetches the complete pricing matrix structured for table rendering
   */
  async getPriceMatrix() {
    // 1. Fetch all categories, types, services, and existing prices in parallel
    const [categories, vehicleTypes, services, servicePrices] =
      await Promise.all([
        this.categoryRepo.find({ order: { id: 'ASC' } }),
        this.vehicleTypeRepo.find({ order: { id: 'ASC' } }),
        this.serviceRepo.find({ order: { id: 'ASC' } }),
        this.servicePriceRepo.find(),
      ]);

    // 2. Nest vehicle types under their respective categories
    const categoriesTree = categories.map((cat) => ({
      categoryId: cat.id,
      categoryName: cat.name,
      vehicleTypes: vehicleTypes
        .filter((vt) => vt.vehicleCategoryId === cat.id)
        .map((vt) => ({
          id: vt.id,
          name: vt.name,
        })),
    }));

    // 3. Build fast O(1) price dictionary: { "serviceId_vehicleTypeId": price }
    const pricesMap: Record<string, number> = {};
    for (const sp of servicePrices) {
      pricesMap[`${sp.serviceId}_${sp.vehicleTypeId}`] = Number(sp.price);
    }

    return {
      categories: categoriesTree,
      services: services.map((s) => ({ id: s.id, name: s.name })),
      prices: pricesMap,
    };
  }

  /**
   * Atomic batch upsert for saving edited prices
   */
  async savePrices(dto: SaveServicePricesDto) {
    await this.dataSource.transaction(async (manager) => {
      const priceRepo = manager.getRepository(ServicePrice);

      for (const item of dto.prices) {
        await priceRepo.upsert(
          {
            serviceId: item.serviceId,
            vehicleTypeId: item.vehicleTypeId,
            price: item.price,
          },
          ['serviceId', 'vehicleTypeId'], // Composite unique constraint
        );
      }
    });

    return {
      success: true,
      message: 'Service prices updated successfully',
      updatedCount: dto.prices.length,
    };
  }
}
