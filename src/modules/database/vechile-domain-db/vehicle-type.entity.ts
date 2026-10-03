import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VehicleCategory } from './vehicle-category.entity';

/**
 * VehicleType entity representing the vehicle_types table in the vehicle domain.
 *
 * Columns:
 * - id: BIGSERIAL auto-increment Primary Key (unique row)
 * - vehicle_category_id: BIGINT FK -> vehicle_categories.id (ON DELETE RESTRICT, ON UPDATE CASCADE, NOT NULL)
 * - name: VARCHAR(50) NOT NULL (type names are short)
 * - description: TEXT NULLABLE (optional description)
 */
@Entity('vehicle_types')
export class VehicleType {
  // ---------------------------------------------------------------------------
  // Column 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Column 2: vehicle_category_id (BIGINT FK -> vehicle_categories.id)
  // ---------------------------------------------------------------------------
  @Index('idx_vehicle_types_vehicle_category_id')
  @Column({ name: 'vehicle_category_id', type: 'bigint', nullable: false })
  vehicleCategoryId!: string;

  @ManyToOne(() => VehicleCategory, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_category_id' })
  vehicleCategory!: VehicleCategory;

  // ---------------------------------------------------------------------------
  // Column 3: name (VARCHAR(50), NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name!: string;

  // ---------------------------------------------------------------------------
  // Column 4: description (TEXT, Optional / Nullable)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description?: string | null;
}
