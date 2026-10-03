import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vehicle } from '../vechile-domain-db/vehicle.entity';

/**
 * ServiceJob entity representing a service job performed on a vehicle.
 * - id: integer primary key
 * - vehicle_id: bigint foreign key referencing vehicles(id) with ON DELETE RESTRICT and ON UPDATE CASCADE
 * - job_date: date
 * - total_cost: numeric
 */
@Entity('service_jobs')
export class ServiceJob {
  @PrimaryGeneratedColumn()
  id!: number;

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
}
