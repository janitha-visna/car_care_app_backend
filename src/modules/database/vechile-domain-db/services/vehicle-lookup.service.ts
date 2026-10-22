import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Vehicle } from '../vehicle.entity';
import { Service } from '../../service-domain-db/entities/service.entity';
import { ServicePrice } from '../../service-domain-db/entities/service-price.entity';

export interface VehicleLookupResponse {
  isRegistered: boolean;
  exactMatch: {
    id: string;
    numberPlate: string;
    category: {
      id: string;
      name: string;
    };
    vehicleType: {
      id: string;
      name: string;
    };
    customer: {
      id: string;
      name: string;
      phoneNumbers: Array<{
        id: string;
        phoneNumber: string;
        isPrimary: boolean;
      }>;
    };
    services: Array<{
      serviceId: string;
      name: string;
      price: number | null;
    }>;
  } | null;
  suggestions: Array<{
    id: string;
    numberPlate: string;
    vehicleTypeName: string;
    customerName: string;
  }>;
}

@Injectable()
export class VehicleLookupService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServicePrice)
    private readonly servicePriceRepository: Repository<ServicePrice>,
  ) {}

  /**
   * Searches by license plate prefix and checks for an exact match.
   * - Always returns 200 OK with { isRegistered, exactMatch, suggestions }.
   * - If exactMatch is found, loads category, vehicleType, customer + phoneNumbers,
   *   and configured service prices for that vehicle's type.
   */
  async lookupByPlate(rawPlate: string): Promise<VehicleLookupResponse> {
    const normalizedPlate = (rawPlate || '').trim().toUpperCase();

    if (!normalizedPlate) {
      return {
        isRegistered: false,
        exactMatch: null,
        suggestions: [],
      };
    }

    const [matchingVehicles, exactVehicle] = await Promise.all([
      this.vehicleRepository.find({
        where: { numberPlate: ILike(`${normalizedPlate}%`) },
        relations: {
          customer: true,
          vehicleType: true,
        },
        order: { numberPlate: 'ASC' },
        take: 5,
      }),
      this.vehicleRepository.findOne({
        where: { numberPlate: normalizedPlate },
        relations: {
          customer: {
            phoneNumbers: true,
          },
          vehicleType: {
            vehicleCategory: true,
          },
        },
      }),
    ]);

    const suggestions = matchingVehicles.map((vehicle) => ({
      id: vehicle.id,
      numberPlate: vehicle.numberPlate,
      vehicleTypeName: vehicle.vehicleType.name,
      customerName: vehicle.customer.name,
    }));

    if (!exactVehicle) {
      return {
        isRegistered: false,
        exactMatch: null,
        suggestions,
      };
    }

    const [allServices, typePrices] = await Promise.all([
      this.serviceRepository.find({ order: { id: 'ASC' } }),
      this.servicePriceRepository.find({
        where: { vehicleTypeId: exactVehicle.vehicleTypeId },
      }),
    ]);

    const priceMap = new Map<string, number>();
    for (const sp of typePrices) {
      priceMap.set(sp.serviceId, sp.price);
    }

    const servicesWithPrices = allServices.map((service) => ({
      serviceId: service.id,
      name: service.name,
      price: priceMap.get(service.id) ?? null,
    }));

    const sortedPhones = [...(exactVehicle.customer.phoneNumbers ?? [])].sort(
      (a, b) => Number(b.isPrimary) - Number(a.isPrimary),
    );

    return {
      isRegistered: true,
      exactMatch: {
        id: exactVehicle.id,
        numberPlate: exactVehicle.numberPlate,
        category: {
          id: exactVehicle.vehicleType.vehicleCategory.id,
          name: exactVehicle.vehicleType.vehicleCategory.name,
        },
        vehicleType: {
          id: exactVehicle.vehicleType.id,
          name: exactVehicle.vehicleType.name,
        },
        customer: {
          id: exactVehicle.customer.id,
          name: exactVehicle.customer.name,
          phoneNumbers: sortedPhones.map((phone) => ({
            id: phone.id,
            phoneNumber: phone.phoneNumber,
            isPrimary: phone.isPrimary,
          })),
        },
        services: servicesWithPrices,
      },
      suggestions,
    };
  }
}
