import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { VehicleAvailableService } from './vehicle-available-service.entity';

/**
 * A global catalog of service packages, such as Body Wash or Full Service.
 */
@Entity('service_types')
export class ServiceType extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 150 })
  name: string;

  @OneToMany(
    () => VehicleAvailableService,
    (availableService) => availableService.serviceType,
  )
  availableServices: VehicleAvailableService[];
}
