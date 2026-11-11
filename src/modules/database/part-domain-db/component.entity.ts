import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Component entity representing the components table in the parts/components domain.
 *
 * Columns:
 * - id: BIGSERIAL auto-increment Primary Key (unique row, always present)
 * - name: VARCHAR(100) NOT NULL, UNIQUE (no duplicate components)
 */
@Entity('components')
export class Component {
  // ---------------------------------------------------------------------------
  // Column 1: id (BIGSERIAL / Auto-increment Primary Key)
  // ---------------------------------------------------------------------------
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  // ---------------------------------------------------------------------------
  // Column 2: name (VARCHAR(100), NOT NULL, UNIQUE)
  // ---------------------------------------------------------------------------
  @Index('idx_components_name', { unique: true })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  name!: string;
}
