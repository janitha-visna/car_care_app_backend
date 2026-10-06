import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Service } from './service.entity';
import { Component } from '../part-domain-db/component.entity';

/**
 * ServiceComponent entity representing the service_components mapper table.
 * Maps services to components required/serviced.
 *
 * Columns:
 * - id: BIGSERIAL auto-increment Primary Key (unique row)
 * - service_id: BIGINT FK -> services.id (ON DELETE CASCADE, ON UPDATE CASCADE, NOT NULL)
 * - component_id: BIGINT FK -> components.id (ON DELETE CASCADE, ON UPDATE CASCADE, NOT NULL)
 */
@Entity('service_components')
export class ServiceComponent {
  // ---------------------------------------------------------------------------
  // Column 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Column 2: service_id (BIGINT FK -> services.id)
  // ---------------------------------------------------------------------------
  @Index('idx_service_components_service_id')
  @Column({ name: 'service_id', type: 'bigint', nullable: false })
  serviceId!: string;

  @ManyToOne(() => Service, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service!: Service;

  // ---------------------------------------------------------------------------
  // Column 3: component_id (BIGINT FK -> components.id)
  // ---------------------------------------------------------------------------
  @Index('idx_service_components_component_id')
  @Column({ name: 'component_id', type: 'bigint', nullable: false })
  componentId!: string;

  @ManyToOne(() => Component, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'component_id' })
  component!: Component;
}
