import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ServiceType } from './service-type.entity';
import { VehicleType } from './vehicle-type.entity';

/**
 * Junction table: which ServiceType is available for which VehicleType.
 * This is the single place that answers "is Full Service offered for
 * Motor Bike?" — enabling/disabling a service for a vehicle type is a
 * write to this table only, never a change to VehicleType or ServiceType.
 */
@Entity('vehicle_service_mapping')
@Index(['vehicleTypeId', 'serviceTypeId'], { unique: true })
export class VehicleServiceMapping extends BaseEntity {
  @Column({ name: 'vehicle_type_id' })
  vehicleTypeId: number;

  @ManyToOne(() => VehicleType, (vehicleType) => vehicleType.serviceMappings, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'vehicle_type_id' })
  vehicleType: VehicleType;

  @Column({ name: 'service_type_id' })
  serviceTypeId: number;

  @ManyToOne(() => ServiceType, (serviceType) => serviceType.vehicleMappings, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceType;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
