import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { User } from './src/users/user.entity';
import { City } from './src/cities/city.entity';
import { Region } from './src/regions/region.entity';
import { Vendor } from './src/vendors/vendor.entity';
import { VendorService } from './src/vendor-services/vendor-service.entity';
import { Order } from './src/orders/order.entity';
import { OrderItem } from './src/order-items/order-item.entity';
import { File } from './src/files/file.entity';
import { Payment } from './src/payments/payment.entity';
import { Transaction } from './src/transactions/transaction.entity';
import { Review } from './src/reviews/review.entity';
import { AuditLog } from './src/audit-logs/audit-log.entity';
import { Session } from './src/sessions/session.entity';

dotenv.config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [
    User, City, Region, Vendor, VendorService, Order, OrderItem, File, Payment, Transaction, Review, AuditLog, Session
  ],
  migrations: [__dirname + '/migrations/**/*.ts'],
  synchronize: false, // Never use true in production
  logging: true,
});

