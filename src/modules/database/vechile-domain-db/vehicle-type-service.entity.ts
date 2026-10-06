import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VehicleType } from './vehicle-type.entity';
import { Service } from '../service-domain-db/service.entity';

/**
 * VehicleTypeService entity representing the vehicle_type_services table.
 * Junction table mapping vehicle types to available services.
 *
 * Columns:
 * - id: BIGSERIAL auto-increment Primary Key (unique row)
 * - vehicle_type_id: BIGINT FK -> vehicle_types.id (ON DELETE CASCADE, ON UPDATE CASCADE, NOT NULL)
 * - service_id: BIGINT FK -> services / service_types.id (ON DELETE CASCADE, ON UPDATE CASCADE, NOT NULL)
 */
@Entity('vehicle_type_services')
export class VehicleTypeService {
  // ---------------------------------------------------------------------------
  // Column 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Column 2: vehicle_type_id (BIGINT FK -> vehicle_types.id)
  // ---------------------------------------------------------------------------
  @Index('idx_vehicle_type_services_vehicle_type_id')
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
  // Column 3: service_id (BIGINT FK -> service_types.id)
  // ---------------------------------------------------------------------------
  @Index('idx_vehicle_type_services_service_id')
  @Column({ name: 'service_id', type: 'bigint', nullable: false })
  serviceId!: string;

  @ManyToOne(() => Service, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'service_id' })
  service!: Service;
}
