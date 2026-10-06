import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Service entity representing the services table in the service domain.
 *
 * Columns:
 * - id: BIGSERIAL auto-increment Primary Key (unique row, always present)
 * - name: VARCHAR(100) NOT NULL, UNIQUE (no duplicate services)
 * - base_price: NUMERIC(10, 2) NOT NULL (exact money, every service must have a price)
 */
@Entity('services')
export class Service {
  // ---------------------------------------------------------------------------
  // Column 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Column 2: name (VARCHAR(100), NOT NULL, UNIQUE)
  // ---------------------------------------------------------------------------
  @Index('idx_services_name', { unique: true })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  name!: string;

  // ---------------------------------------------------------------------------
  // Column 3: base_price (NUMERIC(10, 2), NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'base_price',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => (value != null ? parseFloat(value) : 0),
    },
  })
  basePrice!: number;
}
