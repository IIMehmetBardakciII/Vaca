import Stripe from "stripe";

export const initStripeInstance = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe Secret Key is not found");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-09-30.acacia",
  });

  return stripe;
};
