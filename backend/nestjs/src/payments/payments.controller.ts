import { Controller, Post, Body, Headers, HttpCode, HttpStatus, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  private readonly stripe: Stripe;

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    });
  }

  @Post('create-checkout-session')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  @ApiResponse({ status: 200, description: 'Checkout session created successfully', type: String })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createCheckoutSession(@Body() createCheckoutSessionDto: CreateCheckoutSessionDto): Promise<{ url: string }> {
    return this.paymentsService.createCheckoutSession(createCheckoutSessionDto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook handled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook signature' })
  async handleWebhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
      );
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    await this.paymentsService.handleStripeWebhook(event);
  }
}
