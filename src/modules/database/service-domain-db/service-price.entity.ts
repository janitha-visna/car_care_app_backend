import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Service } from './service.entity';
import { VehicleType } from '../vechile-domain-db/vehicle-type.entity';

/**
 * ServicePrice entity representing price tiers for services based on vehicle types.
 * E.g., Full Service for Small Car vs Full Service for Bus.
 */
@Entity('service_prices')
@Index(
  'idx_service_prices_service_vehicle_type',
  ['serviceId', 'vehicleTypeId'],
  {
    unique: true,
  },
)
export class ServicePrice {
  // ---------------------------------------------------------------------------
  // Column 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Column 2: service_id (BIGINT FK -> services.id)
  // ---------------------------------------------------------------------------
  @Index('idx_service_prices_service_id')
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
  // Column 3: vehicle_type_id (BIGINT FK -> vehicle_types.id)
  // ---------------------------------------------------------------------------
  @Index('idx_service_prices_vehicle_type_id')
  @Column({ name: 'vehicle_type_id', type: 'bigint', nullable: false })
  vehicleTypeId!: string;

  @ManyToOne(() => VehicleType, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicle_type_id' })
  vehicleType!: VehicleType;

  // ---------------------------------------------------------------------------
  // Column 4: price (NUMERIC(10, 2), NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'price',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => (value != null ? parseFloat(value) : 0),
    },
  })
  price!: number;
}
