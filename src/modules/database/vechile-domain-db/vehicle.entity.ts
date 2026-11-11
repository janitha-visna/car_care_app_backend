import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from '../customer-domain-db/customer.entity';
import { VehicleType } from './vehicle-type.entity';
import { ServiceJob } from '../service-job-domain-db/service-job.entity';

/**
 * Vehicle entity representing the vehicles table.
 *
 * Fields:
 * - id: BIGSERIAL auto-increment PK
 * - customer_id: BIGINT FK -> customers.id (ON DELETE RESTRICT, ON UPDATE CASCADE, indexed)
 * - number_plate: VARCHAR(20) UNIQUE, NOT NULL, uppercase & trimmed
 * - vehicle_type_id: BIGINT FK -> vehicle_types.id (ON DELETE RESTRICT, ON UPDATE CASCADE, indexed)
 * - created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */
@Entity('vehicles')
export class Vehicle {
  // ---------------------------------------------------------------------------
  // Field 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Field 2: customer_id (BIGINT FK -> customers.id)
  // ---------------------------------------------------------------------------
  @Index('idx_vehicles_customer_id')
  @Column({ name: 'customer_id', type: 'bigint' })
  customerId!: string;

  @ManyToOne(() => Customer, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  // ---------------------------------------------------------------------------
  // Field 3: number_plate (VARCHAR(20), UNIQUE, NOT NULL, Uppercase, Trimmed)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'number_plate',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  numberPlate!: string;

  // ---------------------------------------------------------------------------
  // Field 4: vehicle_type_id (BIGINT FK -> vehicle_types.id)
  // ---------------------------------------------------------------------------
  @Index('idx_vehicles_vehicle_type_id')
  @Column({ name: 'vehicle_type_id', type: 'bigint' })
  vehicleTypeId!: string;

  @ManyToOne(() => VehicleType, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_type_id' })
  vehicleType!: VehicleType;

  // ---------------------------------------------------------------------------
  // Field 5: created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  // ---------------------------------------------------------------------------
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  // ---------------------------------------------------------------------------
  // Relations (Inverse sides)
  // ---------------------------------------------------------------------------
  @OneToMany(() => ServiceJob, (serviceJob) => serviceJob.vehicle)
  serviceJobs!: ServiceJob[];

  // ---------------------------------------------------------------------------
  // Lifecycle Hooks: Ensure number_plate is trimmed and uppercase
  // ---------------------------------------------------------------------------
  @BeforeInsert()
  @BeforeUpdate()
  normalizeNumberPlate(): void {
    if (this.numberPlate) {
      this.numberPlate = this.numberPlate.trim().toUpperCase();
    }
  }
}
