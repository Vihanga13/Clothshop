// Client-side Stripe helper
export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
};

export default getStripePublishableKey;
