import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * VehicleCategory entity representing the vehicle_categories table in the vehicle domain.
 *
 * Columns:
 * - id: BIGSERIAL auto-increment Primary Key (unique row identifier)
 * - name: VARCHAR(50) NOT NULL (every category must have a name)
 */
@Entity('vehicle_categories')
export class VehicleCategory {
  // ---------------------------------------------------------------------------
  // Column 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Column 2: name (VARCHAR(50), NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name!: string;
}
