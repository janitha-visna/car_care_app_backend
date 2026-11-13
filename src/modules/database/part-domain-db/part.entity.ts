import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Component } from './component.entity';
import { PartMeasurementOption } from './part-measurement-option.entity';

/**
 * Part entity representing the parts/brands catalog table.
 *
 * Columns:
 * - id: BIGSERIAL auto-increment Primary Key (unique row)
 * - component_id: BIGINT FK -> components.id (ON DELETE RESTRICT, ON UPDATE CASCADE, NOT NULL)
 * - name: VARCHAR(255) NOT NULL (part/brand name e.g. Castrol, Mobil, DS40, Denso)
 */
@Entity('parts')
@Index('idx_parts_component_name_unique', ['componentId', 'name'], {
  unique: true,
})
export class Part {
  // ---------------------------------------------------------------------------
  // Column 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Column 2: component_id (BIGINT FK -> components.id)
  // ---------------------------------------------------------------------------
  @Index('idx_parts_component_id')
  @Column({ name: 'component_id', type: 'bigint', nullable: false })
  componentId!: string;

  @ManyToOne(() => Component, (component) => component.parts, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'component_id' })
  component!: Component;

  // ---------------------------------------------------------------------------
  // Column 3: name (VARCHAR(255), NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name!: string;

  // ---------------------------------------------------------------------------
  // Relations (Inverse sides)
  // ---------------------------------------------------------------------------
  @OneToMany(() => PartMeasurementOption, (option) => option.part, {
    cascade: true,
  })
  measurementOptions!: PartMeasurementOption[];
}
