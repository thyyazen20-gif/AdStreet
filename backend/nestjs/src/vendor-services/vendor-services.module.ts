import { Module } from '@nestjs/common';
import { VendorServicesController } from './vendor-services.controller';
import { VendorServicesService } from './vendor-services.service';

@Module({
  controllers: [VendorServicesController],
  providers: [VendorServicesService]
})
export class VendorServicesModule {}
