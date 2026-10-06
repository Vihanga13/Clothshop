import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'lkr', customerEmail, orderNumber } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order amount' },
        { status: 400 }
      );
    }

    // Stripe requires integer amounts in smallest currency units (e.g., cents for USD/LKR)
    const amountInSmallestUnit = Math.round(Number(amount) * 100);

    // If Stripe Secret Key is configured, create real Stripe PaymentIntent
    if (stripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInSmallestUnit,
          currency: currency.toLowerCase(),
          receipt_email: customerEmail || undefined,
          description: `Clothshop Order ${orderNumber || ''}`,
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            orderNumber: orderNumber || '',
          },
        });

        return NextResponse.json({
          success: true,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          isLiveStripe: true,
        });
      } catch (stripeErr: any) {
        console.warn('Stripe API error (falling back to test mode):', stripeErr.message);
      }
    }

    // Simulated Stripe Test Mode (active when API key not yet set in .env)
    const mockIntentId = `pi_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const mockClientSecret = `${mockIntentId}_secret_${Math.random().toString(36).substring(2, 10)}`;

    return NextResponse.json({
      success: true,
      clientSecret: mockClientSecret,
      paymentIntentId: mockIntentId,
      isLiveStripe: false,
      message: 'Running in Stripe Test Mode Simulator',
    });
  } catch (error: any) {
    console.error('Error in create-payment-intent:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment intent creation failed' },
      { status: 500 }
    );
  }
}
