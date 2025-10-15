import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { City } from '../cities/city.entity';
import { Region } from '../regions/region.entity';
import { Vendor } from '../vendors/vendor.entity';
import { VendorService } from '../vendor-services/vendor-service.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../order-items/order-item.entity';
import { File } from '../files/file.entity';
import { Payment } from '../payments/payment.entity';
import { Transaction } from '../transactions/transaction.entity';
import { Review } from '../reviews/review.entity';
import { AuditLog } from '../audit-logs/audit-log.entity';
import { Session } from '../sessions/session.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        entities: [
          User, City, Region, Vendor, VendorService, Order, OrderItem, File, Payment, Transaction, Review, AuditLog, Session
        ],
        synchronize: config.get<boolean>('DATABASE_SYNCHRONIZE'), // Set to false in production
        logging: config.get<boolean>('DATABASE_LOGGING'),
      }),
    }),
  ],
})
export class DatabaseModule {}

