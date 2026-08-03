import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { VehicleAvailableService } from './vehicle-available-service.entity';

/**
 * A global catalog of service options, such as Engine Oil Change.
 */
@Entity('service_options')
export class ServiceOption extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 150 })
  name: string;

  @OneToMany(
    () => VehicleAvailableService,
    (availableService) => availableService.serviceOption,
  )
  availableServices: VehicleAvailableService[];
}
