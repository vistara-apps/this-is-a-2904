import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '10 trades per day',
      'Basic feedback',
      'Limited scenarios',
      'Community support'
    ],
    limitations: [
      'No advanced analytics',
      'No AI coaching',
      'No premium tutorials'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 15,
    priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
    features: [
      'Unlimited trades',
      'Advanced AI feedback',
      'All practice scenarios',
      'Detailed analytics',
      'Priority support',
      'Risk management tools'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 30,
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    features: [
      'Everything in Premium',
      'Personalized AI coaching',
      'Advanced market scenarios',
      'Custom trading strategies',
      'One-on-one mentoring sessions',
      'API access for custom tools'
    ]
  }
};

export const stripeService = {
  // Create checkout session for subscription
  async createCheckoutSession(priceId, customerId = null, successUrl, cancelUrl) {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId,
          successUrl,
          cancelUrl,
          mode: 'subscription'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  },

  // Create customer portal session for managing subscription
  async createPortalSession(customerId, returnUrl) {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Stripe portal error:', error);
      throw error;
    }
  },

  // Get subscription status
  async getSubscriptionStatus(customerId) {
    try {
      const response = await fetch(`/api/subscription-status/${customerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription status error:', error);
      throw error;
    }
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  },

  // Update subscription
  async updateSubscription(subscriptionId, newPriceId) {
    try {
      const response = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          newPriceId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Update subscription error:', error);
      throw error;
    }
  }
};

// Mock implementation for development/demo
export const mockStripeService = {
  async createCheckoutSession(priceId, customerId, successUrl, cancelUrl) {
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would redirect to Stripe Checkout
    // For demo purposes, we'll simulate a successful subscription
    const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.priceId === priceId);
    
    if (plan) {
      // Simulate successful subscription
      const mockSubscription = {
        id: `sub_${Math.random().toString(36).substr(2, 9)}`,
        status: 'active',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        plan: plan.id
      };
      
      // Store in localStorage for demo
      localStorage.setItem('simutrade_subscription', JSON.stringify(mockSubscription));
      
      // Redirect to success URL
      window.location.href = successUrl;
    } else {
      throw new Error('Invalid price ID');
    }
  },

  async createPortalSession(customerId, returnUrl) {
    // Simulate portal access
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In demo, just show an alert
    alert('In a real app, this would open the Stripe Customer Portal for managing your subscription.');
  },

  async getSubscriptionStatus(customerId) {
    // Get mock subscription from localStorage
    const subscription = localStorage.getItem('simutrade_subscription');
    
    if (subscription) {
      return JSON.parse(subscription);
    }
    
    return {
      status: 'inactive',
      plan: 'free'
    };
  },

  async cancelSubscription(subscriptionId) {
    // Remove subscription from localStorage
    localStorage.removeItem('simutrade_subscription');
    
    return {
      status: 'canceled',
      canceled_at: new Date().toISOString()
    };
  },

  async updateSubscription(subscriptionId, newPriceId) {
    const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.priceId === newPriceId);
    
    if (plan) {
      const mockSubscription = {
        id: subscriptionId,
        status: 'active',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        plan: plan.id
      };
      
      localStorage.setItem('simutrade_subscription', JSON.stringify(mockSubscription));
      return mockSubscription;
    }
    
    throw new Error('Invalid price ID');
  }
};

// Export the appropriate service based on environment
export default import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && 
                import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY !== 'your_stripe_publishable_key' 
                ? stripeService 
                : mockStripeService;
