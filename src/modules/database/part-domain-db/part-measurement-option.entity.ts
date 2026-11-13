import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Part } from './part.entity';

export enum MeasurementType {
  LOOSE = 'LOOSE',
  CAN = 'CAN',
  PIECE = 'PIECE',
}

/**
 * PartMeasurementOption entity representing the part_measurement_options table.
 * Defines how a specific part/brand can be measured and sold (e.g., CAN in Cans, LOOSE in Litres, PIECE in Pieces).
 */
@Entity('part_measurement_options')
@Index('idx_part_measurement_options_unique', ['partId', 'type', 'unit'], {
  unique: true,
})
export class PartMeasurementOption {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Index('idx_part_measurement_options_part_id')
  @Column({ name: 'part_id', type: 'bigint', nullable: false })
  partId!: string;

  @ManyToOne(() => Part, (part) => part.measurementOptions, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'part_id' })
  part!: Part;

  @Column({
    name: 'type',
    type: 'enum',
    enum: MeasurementType,
    nullable: false,
  })
  type!: MeasurementType;

  @Column({
    name: 'unit',
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  unit!: string;

  @Column({
    name: 'allow_decimal',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  allowDecimal!: boolean;
}
