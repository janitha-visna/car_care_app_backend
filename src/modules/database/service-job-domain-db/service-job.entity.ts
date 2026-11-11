import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vehicle } from '../vechile-domain-db/vehicle.entity';
import { ServiceJobService } from './service-job-service.entity';
import { ServiceJobPart } from './service-job-part.entity';

/**
 * ServiceJob entity representing a service job performed on a vehicle.
 * - id: integer primary key
 * - vehicle_id: bigint foreign key referencing vehicles(id) with ON DELETE RESTRICT and ON UPDATE CASCADE
 * - job_date: date
 * - total_cost: numeric
 */
@Entity('service_jobs')
export class ServiceJob {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'vehicle_id', type: 'bigint' })
  vehicleId!: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.serviceJobs, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;

  @Column({ name: 'job_date', type: 'date' })
  jobDate!: Date;

  @Column({
    name: 'total_cost',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  totalCost!: number;

  @OneToMany(
    () => ServiceJobService,
    (serviceJobService) => serviceJobService.serviceJob,
  )
  jobServices!: ServiceJobService[];

  @OneToMany(
    () => ServiceJobPart,
    (serviceJobPart) => serviceJobPart.serviceJob,
  )
  jobParts!: ServiceJobPart[];
}
