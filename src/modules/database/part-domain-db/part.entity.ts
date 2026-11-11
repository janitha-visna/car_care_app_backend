import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Component } from './component.entity';

/**
 * Part entity representing the parts catalog table.
 *
 * Columns:
 * - id: BIGSERIAL auto-increment Primary Key (unique row)
 * - component_id: BIGINT FK -> components.id (ON DELETE RESTRICT, ON UPDATE CASCADE, NOT NULL)
 * - part_number: VARCHAR(100) NOT NULL (part numbers can include letters, hyphens)
 * - brand: VARCHAR(100) NOT NULL (brand names are short)
 * - name: VARCHAR(255) NOT NULL (display names can be long)
 */
@Entity('parts')
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

  @ManyToOne(() => Component, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'component_id' })
  component!: Component;

  // ---------------------------------------------------------------------------
  // Column 3: part_number (VARCHAR(100), NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'part_number',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  partNumber!: string;

  // ---------------------------------------------------------------------------
  // Column 4: brand (VARCHAR(100), NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'brand',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  brand!: string;

  // ---------------------------------------------------------------------------
  // Column 5: name (VARCHAR(255), NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name!: string;
}
