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
import { ServiceType } from '../../vehicle-config/entities/service-type.entity';

/**
 * ServiceJobService entity representing the service_job_services table.
 * Links individual services performed to a specific service job.
 *
 * Columns:
 * - id: BIGSERIAL auto-increment Primary Key (unique row)
 * - job_id: BIGINT FK -> service_jobs.id (ON DELETE CASCADE, ON UPDATE CASCADE, NOT NULL)
 * - service_id: BIGINT FK -> services / service_types.id (ON DELETE RESTRICT, ON UPDATE CASCADE, NOT NULL)
 * - created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP (NOT NULL)
 */
@Entity('service_job_services')
export class ServiceJobService {
  // ---------------------------------------------------------------------------
  // Column 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Column 2: job_id (BIGINT FK -> service_jobs.id)
  // ---------------------------------------------------------------------------
  @Index('idx_service_job_services_job_id')
  @Column({ name: 'job_id', type: 'bigint', nullable: false })
  jobId!: string;

  @ManyToOne(() => ServiceJob, (serviceJob) => serviceJob.jobServices, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'job_id' })
  serviceJob!: ServiceJob;

  // ---------------------------------------------------------------------------
  // Column 3: service_id (BIGINT FK -> service_types.id)
  // ---------------------------------------------------------------------------
  @Index('idx_service_job_services_service_id')
  @Column({ name: 'service_id', type: 'bigint', nullable: false })
  serviceId!: string;

  @ManyToOne(() => ServiceType, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service!: ServiceType;

  // ---------------------------------------------------------------------------
  // Column 4: created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  // ---------------------------------------------------------------------------
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
