import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Part entity representing the parts catalog table.
 * Primary key matches part_id (BIGINT) foreign key in service_job_parts.
 */
@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ length: 150 })
  name!: string;

  @Column({ name: 'part_number', length: 100, nullable: true })
  partNumber?: string;
}
