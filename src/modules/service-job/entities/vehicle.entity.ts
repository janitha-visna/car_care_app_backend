import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceJob } from './service-job.entity';

/**
 * Vehicle entity representing the vehicles table.
 * Has bigint primary key id to match the foreign key constraint in service_jobs.
 */
@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'license_plate', length: 50, unique: true })
  licensePlate: string;

  @OneToMany(() => ServiceJob, (serviceJob) => serviceJob.vehicle)
  serviceJobs: ServiceJob[];
}
