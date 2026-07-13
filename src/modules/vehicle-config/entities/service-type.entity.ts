import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ServiceOption } from './service-option.entity';
import { VehicleServiceMapping } from './vehicle-service-mapping.entity';

/**
 * A global catalog of services (Body Wash, Normal Service, Full Service).
 * ServiceType is NOT vehicle-specific — its availability per vehicle type
 * is controlled entirely through VehicleServiceMapping, so the same
 * catalog entry can be reused/enabled independently across vehicle types.
 */
@Entity('service_types')
export class ServiceType extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 150 })
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @OneToMany(() => ServiceOption, (option) => option.serviceType)
  options: ServiceOption[];

  @OneToMany(() => VehicleServiceMapping, (mapping) => mapping.serviceType)
  vehicleMappings: VehicleServiceMapping[];
}
