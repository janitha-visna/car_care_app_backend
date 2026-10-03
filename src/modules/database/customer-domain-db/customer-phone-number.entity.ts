import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

/**
 * CustomerPhoneNumber entity representing the customer_phone_numbers table.
 *
 * Fields:
 * - id: BIGSERIAL auto-increment Primary Key (unique row identifier)
 * - customer_id: BIGINT FK -> customers.id (ON DELETE CASCADE, ON UPDATE CASCADE, NOT NULL)
 * - phone_number: VARCHAR(20) NOT NULL (stores the customer phone number)
 */
@Entity('customer_phone_numbers')
export class CustomerPhoneNumber {
  // ---------------------------------------------------------------------------
  // Field 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Field 2: customer_id (BIGINT FK -> customers.id)
  // ---------------------------------------------------------------------------
  @Index('idx_customer_phone_numbers_customer_id')
  @Column({ name: 'customer_id', type: 'bigint', nullable: false })
  customerId!: string;

  @ManyToOne(() => Customer, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  // ---------------------------------------------------------------------------
  // Field 3: phone_number (VARCHAR(20), NOT NULL)
  // ---------------------------------------------------------------------------
  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  phoneNumber!: string;
}
