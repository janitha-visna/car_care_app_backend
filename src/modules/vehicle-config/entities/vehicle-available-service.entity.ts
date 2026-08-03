import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ServiceOption } from './service-option.entity';
import { ServiceType } from './service-type.entity';
import { VehicleType } from './vehicle-type.entity';

/**
 * Defines which service options are available for a vehicle type and
 * service package combination.
 */
@Entity('vehicle_available_services')
@Index(['vehicleTypeId', 'serviceTypeId', 'serviceOptionId'], { unique: true })
export class VehicleAvailableService extends BaseEntity {
  @Column({ name: 'vehicle_type_id' })
  vehicleTypeId: number;

  @ManyToOne(
    () => VehicleType,
    (vehicleType) => vehicleType.availableServices,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'vehicle_type_id' })
  vehicleType: VehicleType;

  @Column({ name: 'service_type_id' })
  serviceTypeId: number;

  @ManyToOne(
    () => ServiceType,
    (serviceType) => serviceType.availableServices,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceType;

  @Column({ name: 'service_option_id' })
  serviceOptionId: number;

  @ManyToOne(
    () => ServiceOption,
    (serviceOption) => serviceOption.availableServices,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'service_option_id' })
  serviceOption: ServiceOption;

}
