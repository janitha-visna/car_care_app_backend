import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Component entity representing the components table.
 * Primary key matches component_id (BIGINT) foreign key in parts.
 */
@Entity('components')
export class Component {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ length: 150 })
  name!: string;
}
