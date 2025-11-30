// Stripe client using standard environment variables
// Works locally with VS Code - no Replit-specific dependencies
import Stripe from 'stripe';

function getCredentials() {
  // Use environment variables directly for local development
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.VITE_STRIPE_PUBLIC_KEY;

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
  }

  if (!publishableKey) {
    throw new Error('VITE_STRIPE_PUBLIC_KEY environment variable is required');
  }

  return {
    secretKey,
    publishableKey,
  };
}

export function getStripeClient() {
  const { secretKey } = getCredentials();

  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
  });
}

export async function getUncachableStripeClient() {
  return getStripeClient();
}

export function getStripePublishableKey() {
  const { publishableKey } = getCredentials();
  return publishableKey;
}

export function getStripeSecretKey() {
  const { secretKey } = getCredentials();
  return secretKey;
}
