import Stripe from "stripe";

export function getStripeServer() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}
