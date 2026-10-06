import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VehicleType } from './vehicle-type.entity';
import { Part } from '../part-domain-db/part.entity';

/**
 * VehicleTypeComponentPart entity representing the vehicle_type_component_parts table.
 * Junction/mapper table linking vehicle types to compatible parts.
 *
 * Columns:
 * - id: BIGSERIAL auto-increment Primary Key (unique row)
 * - vehicle_type_id: BIGINT FK -> vehicle_types.id (ON DELETE CASCADE, ON UPDATE CASCADE, NOT NULL)
 * - part_id: BIGINT FK -> parts.id (ON DELETE CASCADE, ON UPDATE CASCADE, NOT NULL)
 */
@Entity('vehicle_type_component_parts')
export class VehicleTypeComponentPart {
  // ---------------------------------------------------------------------------
  // Column 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Column 2: vehicle_type_id (BIGINT FK -> vehicle_types.id)
  // ---------------------------------------------------------------------------
  @Index('idx_vehicle_type_component_parts_vehicle_type_id')
  @Column({ name: 'vehicle_type_id', type: 'bigint', nullable: false })
  vehicleTypeId!: string;

  @ManyToOne(() => VehicleType, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_type_id' })
  vehicleType!: VehicleType;

  // ---------------------------------------------------------------------------
  // Column 3: part_id (BIGINT FK -> parts.id)
  // ---------------------------------------------------------------------------
  @Index('idx_vehicle_type_component_parts_part_id')
  @Column({ name: 'part_id', type: 'bigint', nullable: false })
  partId!: string;

  @ManyToOne(() => Part, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'part_id' })
  part!: Part;
}
