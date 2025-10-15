import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Vendor } from '../vendors/vendor.entity';

@Entity('vendor_services')
export class VendorService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ name: 'vendor_id' })
  vendorId: string;

  @Column({ name: 'service_name_ar', length: 255 })
  serviceNameAr: string;

  @Column({ name: 'service_name_en', length: 255 })
  serviceNameEn: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'base_price', type: 'numeric', precision: 10, scale: 2, nullable: true })
  basePrice: number;

  @Column({ name: 'unit_of_measure', length: 50, nullable: true })
  unitOfMeasure: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

