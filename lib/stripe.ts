// Lightweight Stripe configuration helper (no external npm dependencies required)
export const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const isStripeConfigured = () => {
  return Boolean(stripeSecretKey && !stripeSecretKey.includes('placeholder'));
};

export default {
  stripeSecretKey,
  isStripeConfigured,
};
