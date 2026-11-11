import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceJob } from './service-job.entity';
import { Part } from '../part-domain-db/part.entity';

export enum SupplySource {
  SHOP_SUPPLIED = 'SHOP_SUPPLIED',
  CUSTOMER_SUPPLIED = 'CUSTOMER_SUPPLIED',
}

export enum PartUnit {
  UNIT = 'UNIT',
  LITER = 'LITER',
  ML = 'ML',
  BOTTLE = 'BOTTLE',
  CAN = 'CAN',
  PACK = 'PACK',
}

/**
 * ServiceJobPart entity representing the service_job_parts table in the service job domain.
 * Links parts used/replaced to a specific service job.
 *
 * Columns:
 * - id: BIGSERIAL auto-increment Primary Key (unique row, always present)
 * - job_id: BIGINT FK -> service_jobs.id (ON DELETE CASCADE, ON UPDATE CASCADE, NOT NULL)
 * - part_id: BIGINT FK -> parts.id (ON DELETE RESTRICT, ON UPDATE CASCADE, NOT NULL)
 * - supply_source: ENUM ('SHOP_SUPPLIED', 'CUSTOMER_SUPPLIED') NOT NULL DEFAULT 'SHOP_SUPPLIED'
 * - quantity: NUMERIC(10, 2) NOT NULL DEFAULT 1 (supports decimals like 3.5 liters and integers like 1 filter)
 * - unit: ENUM ('UNIT', 'LITER', 'ML', 'BOTTLE', 'CAN', 'PACK') NOT NULL DEFAULT 'UNIT'
 * - created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP (NOT NULL)
 */
@Entity('service_job_parts')
export class ServiceJobPart {
  // ---------------------------------------------------------------------------
  // Column 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Column 2: job_id (BIGINT FK -> service_jobs.id)
  // ---------------------------------------------------------------------------
  @Index('idx_service_job_parts_job_id')
  @Column({ name: 'job_id', type: 'bigint', nullable: false })
  jobId!: string;

  @ManyToOne(() => ServiceJob, (serviceJob) => serviceJob.jobParts, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'job_id' })
  serviceJob!: ServiceJob;

  // ---------------------------------------------------------------------------
  // Column 3: part_id (BIGINT FK -> parts.id)
  // ---------------------------------------------------------------------------
  @Index('idx_service_job_parts_part_id')
  @Column({ name: 'part_id', type: 'bigint', nullable: false })
  partId!: string;

  @ManyToOne(() => Part, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'part_id' })
  part!: Part;

  // ---------------------------------------------------------------------------
  // Column 4: supply_source (ENUM: 'SHOP_SUPPLIED' | 'CUSTOMER_SUPPLIED')
  // ---------------------------------------------------------------------------
  @Column({
    name: 'supply_source',
    type: 'enum',
    enum: SupplySource,
    default: SupplySource.SHOP_SUPPLIED,
    nullable: false,
  })
  supplySource!: SupplySource;

  // ---------------------------------------------------------------------------
  // Column 5: quantity (NUMERIC(10, 2), NOT NULL, DEFAULT 1)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'quantity',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 1,
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => (value != null ? parseFloat(value) : 1),
    },
  })
  quantity!: number;

  // ---------------------------------------------------------------------------
  // Column 6: unit (ENUM: 'UNIT' | 'LITER' | 'ML' | 'BOTTLE' | 'CAN' | 'PACK')
  // ---------------------------------------------------------------------------
  @Column({
    name: 'unit',
    type: 'enum',
    enum: PartUnit,
    default: PartUnit.UNIT,
    nullable: false,
  })
  unit!: PartUnit;

  // ---------------------------------------------------------------------------
  // Column 7: created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  // ---------------------------------------------------------------------------
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
