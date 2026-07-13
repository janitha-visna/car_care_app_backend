import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ServiceType } from './service-type.entity';

/**
 * A selectable line item under a service (e.g. "Engine Oil Change" under
 * Normal Service). `required` drives frontend auto-selection — the
 * frontend has no hardcoded knowledge of which options are mandatory.
 */
@Entity('service_options')
@Index(['serviceTypeId', 'name'], { unique: true })
export class ServiceOption extends BaseEntity {
  @Column({ name: 'service_type_id' })
  serviceTypeId: number;

  @ManyToOne(() => ServiceType, (serviceType) => serviceType.options, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_type_id' })
  serviceType: ServiceType;

  @Column({ length: 150 })
  name: string;

  @Column({ default: false })
  required: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
