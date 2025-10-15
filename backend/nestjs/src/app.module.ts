import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CitiesModule } from './cities/cities.module';
import { RegionsModule } from './regions/regions.module';
import { VendorsModule } from './vendors/vendors.module';
import { VendorServicesModule } from './vendor-services/vendor-services.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { FilesModule } from './files/files.module';
import { PaymentsModule } from './payments/payments.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { SessionsModule } from './sessions/sessions.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CitiesModule,
    RegionsModule,
    VendorsModule,
    VendorServicesModule,
    OrdersModule,
    OrderItemsModule,
    FilesModule,
    PaymentsModule,
    TransactionsModule,
    ReviewsModule,
    AuditLogsModule,
    SessionsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

