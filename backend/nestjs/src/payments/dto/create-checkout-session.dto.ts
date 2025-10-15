import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateCheckoutSessionDto {
  @ApiProperty({ example: 'uuid-of-order', description: 'The ID of the order to be paid for' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ example: 100.00, description: 'The total amount to be paid' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'SAR', description: 'The currency of the payment' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'http://localhost:3000/success', description: 'URL to redirect after successful payment' })
  @IsString()
  successUrl: string;

  @ApiProperty({ example: 'http://localhost:3000/cancel', description: 'URL to redirect after cancelled payment' })
  @IsString()
  cancelUrl: string;
}

