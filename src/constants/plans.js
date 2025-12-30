/**
 * Subscription Plans & Billing Constants
 */

export const PLAN_TYPES = {
  FREE: 'free',
  STARTER: 'starter',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
  CUSTOM: 'custom'
}

export const BILLING_PERIODS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime'
}

export const PLAN_FEATURES = {
  [PLAN_TYPES.FREE]: {
    name: 'Free',
    price: 0,
    maxUsers: 3,
    maxStorage: 1, // GB
    maxApiCalls: 1000,
    analytics: false,
    integrations: false,
    customBranding: false,
    prioritySupport: false,
    features: [
      'Up to 3 users',
      '1GB storage',
      '1,000 API calls/month',
      'Basic dashboard',
      'Email support'
    ]
  },
  
  [PLAN_TYPES.STARTER]: {
    name: 'Starter',
    price: 29,
    maxUsers: 10,
    maxStorage: 10, // GB
    maxApiCalls: 10000,
    analytics: true,
    integrations: true,
    customBranding: false,
    prioritySupport: false,
    features: [
      'Up to 10 users',
      '10GB storage',
      '10,000 API calls/month',
      'Advanced analytics',
      'Basic integrations',
      'Email support'
    ]
  },
  
  [PLAN_TYPES.PROFESSIONAL]: {
    name: 'Professional',
    price: 99,
    maxUsers: 50,
    maxStorage: 100, // GB
    maxApiCalls: 100000,
    analytics: true,
    integrations: true,
    customBranding: true,
    prioritySupport: true,
    features: [
      'Up to 50 users',
      '100GB storage',
      '100,000 API calls/month',
      'Advanced analytics',
      'All integrations',
      'Custom branding',
      'Priority support',
      'API access'
    ]
  },
  
  [PLAN_TYPES.ENTERPRISE]: {
    name: 'Enterprise',
    price: 299,
    maxUsers: -1, // Unlimited
    maxStorage: -1, // Unlimited
    maxApiCalls: -1, // Unlimited
    analytics: true,
    integrations: true,
    customBranding: true,
    prioritySupport: true,
    features: [
      'Unlimited users',
      'Unlimited storage',
      'Unlimited API calls',
      'Advanced analytics',
      'All integrations',
      'Custom branding',
      'Dedicated support',
      'SLA guarantee',
      'Custom features'
    ]
  }
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  REFUNDED: 'refunded'
}

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  TRIALING: 'trialing',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  EXPIRED: 'expired'
}

