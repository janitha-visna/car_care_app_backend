import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { CreateServiceJobDto } from '../dto/create-service-job.dto';
import { ServiceJob } from '../service-job.entity';
import { ServiceJobService as ServiceJobServiceEntity } from '../service-job-service.entity';
import { ServiceJobPart, SupplySource } from '../service-job-part.entity';
import { Vehicle } from '../../vechile-domain-db/vehicle.entity';
import { VehicleType } from '../../vechile-domain-db/vehicle-type.entity';
import { Customer } from '../../customer-domain-db/customer.entity';
import { CustomerPhoneNumber } from '../../customer-domain-db/customer-phone-number.entity';
import { MeterReading } from '../../meter-domain-db/meter-reading.entity';
import { Service } from '../../service-domain-db/entities/service.entity';
import { ServicePrice } from '../../service-domain-db/entities/service-price.entity';
import { PartMeasurementOption } from '../../part-domain-db/part-measurement-option.entity';

@Injectable()
export class ServiceJobDomainService {
  constructor(private readonly dataSource: DataSource) {}

  async createServiceJob(dto: CreateServiceJobDto) {
    // 1. Pre-check odometer readings before opening a DB transaction
    if (
      dto.meterReading != null &&
      dto.nextMeterReading != null &&
      dto.nextMeterReading <= dto.meterReading
    ) {
      throw new BadRequestException(
        'nextMeterReading must be greater than meterReading',
      );
    }

    const normalizedPlate = dto.vehicle.numberPlate.trim().toUpperCase();
    if (!normalizedPlate) {
      throw new BadRequestException('Vehicle numberPlate cannot be empty');
    }

    return this.dataSource.transaction(async (manager) => {
      const vehicleTypeRepo = manager.getRepository(VehicleType);
      const customerRepo = manager.getRepository(Customer);
      const phoneRepo = manager.getRepository(CustomerPhoneNumber);
      const vehicleRepo = manager.getRepository(Vehicle);
      const meterRepo = manager.getRepository(MeterReading);
      const serviceRepo = manager.getRepository(Service);
      const servicePriceRepo = manager.getRepository(ServicePrice);
      const measurementOptionRepo = manager.getRepository(
        PartMeasurementOption,
      );
      const jobRepo = manager.getRepository(ServiceJob);
      const jobServiceRepo = manager.getRepository(ServiceJobServiceEntity);
      const jobPartRepo = manager.getRepository(ServiceJobPart);

      // -----------------------------------------------------------------------
      // Step 1: Validate VehicleType & Service Package
      // -----------------------------------------------------------------------
      const [vehicleType, servicePackage] = await Promise.all([
        vehicleTypeRepo.findOne({
          where: { id: dto.vehicle.vehicleTypeId },
          relations: { vehicleCategory: true },
        }),
        serviceRepo.findOne({
          where: { id: dto.servicePackageId },
        }),
      ]);

      if (!vehicleType) {
        throw new NotFoundException(
          `VehicleType with id "${dto.vehicle.vehicleTypeId}" not found`,
        );
      }

      if (!servicePackage) {
        throw new NotFoundException(
          `Service package with id "${dto.servicePackageId}" not found`,
        );
      }

      // -----------------------------------------------------------------------
      // Step 2: Validate Products, Brands & Measurement Options
      // -----------------------------------------------------------------------
      const optionMap = new Map<string, PartMeasurementOption>();

      if (dto.products.length > 0) {
        const optionIds = [
          ...new Set(dto.products.map((p) => p.measurementOptionId)),
        ];
        const options = await measurementOptionRepo.find({
          where: { id: In(optionIds) },
          relations: {
            part: {
              component: true,
            },
          },
        });

        for (const opt of options) {
          optionMap.set(String(opt.id), opt);
        }

        for (const item of dto.products) {
          const opt = optionMap.get(String(item.measurementOptionId));
          if (!opt) {
            throw new BadRequestException(
              `MeasurementOption with id "${item.measurementOptionId}" not found`,
            );
          }

          if (String(opt.part.id) !== String(item.brandId)) {
            throw new BadRequestException(
              `MeasurementOption "${item.measurementOptionId}" does not belong to brand/part "${item.brandId}"`,
            );
          }

          if (String(opt.part.componentId) !== String(item.productId)) {
            throw new BadRequestException(
              `Brand/part "${item.brandId}" does not belong to product "${item.productId}"`,
            );
          }

          if (!opt.allowDecimal && !Number.isInteger(item.quantity)) {
            throw new BadRequestException(
              `Decimal quantity (${item.quantity}) is not allowed for "${opt.part.component.name} - ${opt.part.name}" (${opt.unit})`,
            );
          }
        }
      }

      // -----------------------------------------------------------------------
      // Step 3: Resolve Existing Vehicle (by id or numberPlate)
      // -----------------------------------------------------------------------
      const [vehicleById, vehicleByPlate] = await Promise.all([
        dto.vehicle.id
          ? vehicleRepo.findOne({ where: { id: dto.vehicle.id } })
          : Promise.resolve(null),
        vehicleRepo.findOne({ where: { numberPlate: normalizedPlate } }),
      ]);

      if (
        vehicleById &&
        vehicleByPlate &&
        String(vehicleById.id) !== String(vehicleByPlate.id)
      ) {
        throw new ConflictException(
          `Vehicle id "${dto.vehicle.id}" does not match existing vehicle with plate "${normalizedPlate}"`,
        );
      }

      let vehicle = vehicleById ?? vehicleByPlate;

      // -----------------------------------------------------------------------
      // Step 4: Upsert Customer & Sync Phone Numbers
      // -----------------------------------------------------------------------
      const targetCustomerId = dto.customer.id ?? vehicle?.customerId ?? null;
      let customer: Customer | null = null;

      if (targetCustomerId) {
        customer = await customerRepo.findOne({
          where: { id: targetCustomerId },
        });
        if (!customer) {
          throw new NotFoundException(
            `Customer with id "${targetCustomerId}" not found`,
          );
        }

        const trimmedName = dto.customer.name.trim();
        if (customer.name !== trimmedName) {
          customer.name = trimmedName;
          customer = await customerRepo.save(customer);
        }
      } else {
        customer = await customerRepo.save(
          customerRepo.create({
            name: dto.customer.name.trim(),
          }),
        );
      }

      // Normalize and deduplicate phone numbers, guaranteeing one primary number
      const uniquePhones = new Map<string, boolean>();
      for (const p of dto.customer.phones) {
        const cleaned = p.number.trim();
        if (!cleaned) continue;
        const prevPrimary = uniquePhones.get(cleaned) ?? false;
        uniquePhones.set(cleaned, prevPrimary || p.isPrimary);
      }

      const phoneEntries = Array.from(uniquePhones.entries()).map(
        ([phoneNumber, isPrimary]) => ({
          phoneNumber,
          isPrimary,
        }),
      );

      if (phoneEntries.length > 0) {
        const firstPrimaryIdx = phoneEntries.findIndex((p) => p.isPrimary);
        phoneEntries.forEach((p, idx) => {
          p.isPrimary =
            firstPrimaryIdx === -1 ? idx === 0 : idx === firstPrimaryIdx;
        });

        await phoneRepo.delete({ customerId: customer.id });
        const savedPhones = await phoneRepo.save(
          phoneEntries.map((p) =>
            phoneRepo.create({
              customerId: customer.id,
              phoneNumber: p.phoneNumber,
              isPrimary: p.isPrimary,
            }),
          ),
        );
        customer.phoneNumbers = savedPhones;
      } else {
        customer.phoneNumbers = [];
      }

      // -----------------------------------------------------------------------
      // Step 5: Upsert Vehicle
      // -----------------------------------------------------------------------
      if (!vehicle) {
        vehicle = await vehicleRepo.save(
          vehicleRepo.create({
            numberPlate: normalizedPlate,
            customerId: customer.id,
            vehicleTypeId: vehicleType.id,
          }),
        );
      } else {
        let needsUpdate = false;
        if (vehicle.numberPlate !== normalizedPlate) {
          vehicle.numberPlate = normalizedPlate;
          needsUpdate = true;
        }
        if (String(vehicle.customerId) !== String(customer.id)) {
          vehicle.customerId = customer.id;
          needsUpdate = true;
        }
        if (String(vehicle.vehicleTypeId) !== String(vehicleType.id)) {
          vehicle.vehicleTypeId = vehicleType.id;
          needsUpdate = true;
        }
        if (needsUpdate) {
          vehicle = await vehicleRepo.save(vehicle);
        }
      }

      // -----------------------------------------------------------------------
      // Step 6: Insert Meter Reading (if provided)
      // -----------------------------------------------------------------------
      let savedMeterReading: MeterReading | null = null;
      if (dto.meterReading != null) {
        savedMeterReading = await meterRepo.save(
          meterRepo.create({
            vehicleId: vehicle.id,
            reading: String(Math.round(dto.meterReading)),
            readingDate: new Date(dto.jobDate),
            nextReadingDue:
              dto.nextMeterReading != null
                ? String(Math.round(dto.nextMeterReading))
                : null,
          }),
        );
      }

      // -----------------------------------------------------------------------
      // Step 7: Snapshot Service Price & Create ServiceJob + Line Items
      // -----------------------------------------------------------------------
      const configuredServicePrice = await servicePriceRepo.findOne({
        where: {
          serviceId: servicePackage.id,
          vehicleTypeId: vehicleType.id,
        },
      });

      const snapshotUnitPrice = configuredServicePrice
        ? Number(configuredServicePrice.price)
        : 0;

      const resolvedTotalCost =
        dto.totalCost ?? dto.estimatedCost ?? snapshotUnitPrice;

      const savedJob = await jobRepo.save(
        jobRepo.create({
          vehicleId: vehicle.id,
          jobDate: new Date(dto.jobDate),
          totalCost: resolvedTotalCost,
        }),
      );

      const savedJobService = await jobServiceRepo.save(
        jobServiceRepo.create({
          jobId: savedJob.id,
          serviceId: servicePackage.id,
          unitPrice: snapshotUnitPrice,
        }),
      );

      const savedJobParts =
        dto.products.length > 0
          ? await jobPartRepo.save(
              dto.products.map((item) =>
                jobPartRepo.create({
                  jobId: savedJob.id,
                  partId: item.brandId,
                  measurementOptionId: item.measurementOptionId,
                  quantity: item.quantity,
                  supplySource: item.supplySource ?? SupplySource.SHOP_SUPPLIED,
                }),
              ),
            )
          : [];

      return {
        id: Number(savedJob.id),
        jobDate: dto.jobDate,
        totalCost: Number(savedJob.totalCost),
        vehicle: {
          id: Number(vehicle.id),
          numberPlate: vehicle.numberPlate,
          vehicleTypeId: Number(vehicleType.id),
          vehicleTypeName: vehicleType.name,
          categoryName: vehicleType.vehicleCategory.name,
        },
        customer: {
          id: Number(customer.id),
          name: customer.name,
          phones: (customer.phoneNumbers ?? []).map((p) => ({
            id: Number(p.id),
            number: p.phoneNumber,
            isPrimary: p.isPrimary,
          })),
        },
        meterReading: savedMeterReading
          ? {
              id: Number(savedMeterReading.id),
              reading: Number(savedMeterReading.reading),
              nextReadingDue:
                savedMeterReading.nextReadingDue != null
                  ? Number(savedMeterReading.nextReadingDue)
                  : null,
            }
          : null,
        servicePackage: {
          id: Number(savedJobService.id),
          serviceId: Number(servicePackage.id),
          name: servicePackage.name,
          unitPrice: Number(savedJobService.unitPrice),
        },
        products: savedJobParts.map((jp) => {
          const opt = optionMap.get(String(jp.measurementOptionId))!;
          return {
            id: Number(jp.id),
            productId: Number(opt.part.component.id),
            productName: opt.part.component.name,
            brandId: Number(opt.part.id),
            brandName: opt.part.name,
            measurementOptionId: Number(opt.id),
            measurementType: opt.type,
            unit: opt.unit,
            quantity: Number(jp.quantity),
            supplySource: jp.supplySource,
          };
        }),
      };
    });
  }

  async getMonthlyRevenue(year: number) {
    const startDate = `${year}-01-01`;
    const endDate = `${year + 1}-01-01`;

    const rows = await this.dataSource
      .getRepository(ServiceJob)
      .createQueryBuilder('job')
      .select('EXTRACT(MONTH FROM job.job_date)::int', 'month')
      .addSelect('COALESCE(SUM(job.total_cost), 0)', 'revenue')
      .where('job.job_date >= :startDate AND job.job_date < :endDate', {
        startDate,
        endDate,
      })
      .groupBy('EXTRACT(MONTH FROM job.job_date)')
      .orderBy('month', 'ASC')
      .getRawMany<{ month: number; revenue: string }>();

    const monthLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const rowByMonth = new Map(
      rows.map((r) => [Number(r.month), Number(r.revenue)]),
    );

    const months = monthLabels.map((label, index) => {
      const monthNumber = index + 1;
      return {
        month: monthNumber,
        label,
        revenue: rowByMonth.get(monthNumber) ?? 0,
      };
    });

    const totalRevenue = months.reduce((sum, m) => sum + m.revenue, 0);

    return {
      year,
      totalRevenue,
      months,
    };
  }
}
