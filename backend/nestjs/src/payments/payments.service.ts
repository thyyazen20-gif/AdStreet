import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Order } from '../orders/order.entity';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    });
  }

  async createCheckoutSession(createCheckoutSessionDto: CreateCheckoutSessionDto): Promise<{ url: string }> {
    const { orderId, amount, currency, successUrl, cancelUrl } = createCheckoutSessionDto;

    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Order ${orderId}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { orderId },
    });

    // Create a pending payment record
    const payment = this.paymentsRepository.create({
      orderId,
      amount,
      currency,
      status: 'pending',
      transactionId: session.id, // Use Stripe session ID as transaction ID initially
    });
    await this.paymentsRepository.save(payment);

    return { url: session.url };
  }

  async handleStripeWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata.orderId;
        const payment = await this.paymentsRepository.findOne({ where: { orderId, transactionId: session.id } });

        if (payment) {
          payment.status = 'succeeded';
          payment.gatewayResponse = session;
          await this.paymentsRepository.save(payment);
          // TODO: Update order status to 'accepted' or 'in_progress'
        }
        break;
      case 'checkout.session.async_payment_failed':
        const failedSession = event.data.object as Stripe.Checkout.Session;
        const failedOrderId = failedSession.metadata.orderId;
        const failedPayment = await this.paymentsRepository.findOne({ where: { orderId: failedOrderId, transactionId: failedSession.id } });

        if (failedPayment) {
          failedPayment.status = 'failed';
          failedPayment.gatewayResponse = failedSession;
          await this.paymentsRepository.save(failedPayment);
          // TODO: Handle failed payment, e.g., notify user
        }
        break;
      // Handle other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
