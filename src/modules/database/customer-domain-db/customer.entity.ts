import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Customer entity representing the customers table.
 *
 * Fields:
 * - id: BIGSERIAL auto-increment Primary Key (unique row identifier)
 * - name: VARCHAR(255) NOT NULL (every customer must have a name)
 */
@Entity('customers')
export class Customer {
  // ---------------------------------------------------------------------------
  // Field 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Field 2: name (VARCHAR(255), NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name!: string;
}
