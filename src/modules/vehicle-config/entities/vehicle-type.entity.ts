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
import { VehicleServiceMapping } from './vehicle-service-mapping.entity';

/**
 * A specific vehicle type within a category (e.g. "Small Bus" under Bus,
 * "Alto" under Car). Which services it supports is NOT stored here —
 * that comes from VehicleServiceMapping so it can be reconfigured
 * without touching this row.
 */
@Entity('vehicle_types')
@Index(['categoryId', 'name'], { unique: true })
export class VehicleType extends BaseEntity {
  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => VehicleCategory, (category) => category.vehicleTypes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: VehicleCategory;

  @Column({ length: 150 })
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @OneToMany(() => VehicleServiceMapping, (mapping) => mapping.vehicleType)
  serviceMappings: VehicleServiceMapping[];
}
