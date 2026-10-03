import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vehicle } from '../vechile-domain-db/vehicle.entity';

/**
 * MeterReading entity representing the meter_readings table in the meter domain.
 *
 * Fields:
 * - id: BIGSERIAL auto-increment Primary Key (unique row, always present)
 * - vehicle_id: BIGINT FK -> vehicles.id (ON DELETE RESTRICT, ON UPDATE CASCADE, indexed, NOT NULL)
 * - reading: BIGINT NOT NULL (odometer reading, can be large)
 * - reading_date: DATE NOT NULL (date of reading for time-based analysis)
 * - next_reading_due: BIGINT NULLABLE (projected next reading, optional)
 */
@Entity('meter_readings')
export class MeterReading {
  // ---------------------------------------------------------------------------
  // Field 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Field 2: vehicle_id (BIGINT FK -> vehicles.id)
  // ---------------------------------------------------------------------------
  @Index('idx_meter_readings_vehicle_id')
  @Column({ name: 'vehicle_id', type: 'bigint', nullable: false })
  vehicleId!: string;

  @ManyToOne(() => Vehicle, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;

  // ---------------------------------------------------------------------------
  // Field 3: reading (BIGINT, NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({ name: 'reading', type: 'bigint', nullable: false })
  reading!: string;

  // ---------------------------------------------------------------------------
  // Field 4: reading_date (DATE, NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({ name: 'reading_date', type: 'date', nullable: false })
  readingDate!: Date;

  // ---------------------------------------------------------------------------
  // Field 5: next_reading_due (BIGINT, NULLABLE / Optional)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'next_reading_due',
    type: 'bigint',
    nullable: true,
  })
  nextReadingDue?: string | null;
}
