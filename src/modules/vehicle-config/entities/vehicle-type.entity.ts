import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { VehicleCategory } from './vehicle-category.entity';
import { VehicleAvailableService } from './vehicle-available-service.entity';

/**
 * A specific vehicle type within a category, such as "Mini Car" under Car.
 */
@Entity('vehicle_types')
@Index(['vehicleCategoryId', 'name'], { unique: true })
export class VehicleType extends BaseEntity {
  @Column({ name: 'vehicle_category_id' })
  vehicleCategoryId: number;

  @ManyToOne(() => VehicleCategory, (category) => category.vehicleTypes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'vehicle_category_id' })
  category: VehicleCategory;

  @Column({ length: 150 })
  name: string;

  @OneToMany(
    () => VehicleAvailableService,
    (availableService) => availableService.vehicleType,
  )
  availableServices: VehicleAvailableService[];
}
