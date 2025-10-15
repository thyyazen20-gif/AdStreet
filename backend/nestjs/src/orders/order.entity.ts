import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Vendor } from '../vendors/vendor.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Vendor, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ name: 'vendor_id', nullable: true })
  vendorId: string;

  @Column({ name: 'order_type', length: 50 })
  orderType: 'instant' | 'quote_request';

  @Column({ length: 50 })
  @Index()
  status: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  specifications: object;

  @Column({ name: 'final_price', type: 'numeric', precision: 10, scale: 2, nullable: true })
  finalPrice: number;

  @Column({ length: 10, default: 'SAR' })
  currency: string;

  @Column({ name: 'delivery_date', type: 'date', nullable: true })
  deliveryDate: Date;

  @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

