import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { VehicleType } from './vehicle-type.entity';

/**
 * Top-level grouping of vehicles (Car, Bus, Van, Lorry, Bike).
 * Admin-managed catalog entry — never hard-deleted, only deactivated,
 * so historical service records always resolve to a valid category.
 */
@Entity('vehicle_categories')
export class VehicleCategory extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 100 })
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => VehicleType, (vehicleType) => vehicleType.category)
  vehicleTypes: VehicleType[];
}
