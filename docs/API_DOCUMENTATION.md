# SimuTrade API Documentation

This document provides comprehensive API documentation for the SimuTrade application, covering all integrations and services as specified in the PRD.

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Trading Operations](#trading-operations)
4. [Scenarios & Tutorials](#scenarios--tutorials)
5. [Market Data](#market-data)
6. [Analytics & Feedback](#analytics--feedback)
7. [Subscription Management](#subscription-management)
8. [Real-time Features](#real-time-features)

## Authentication

### Supabase Authentication

SimuTrade uses Supabase Auth for user authentication with email/password and social login options.

#### Sign Up
```javascript
import { authService } from '../services/supabaseService';

const signUp = async (email, password, userData) => {
  try {
    const result = await authService.signUp(email, password, {
      username: userData.username,
      // Additional user metadata
    });
    return result;
  } catch (error) {
    console.error('Sign up error:', error);
  }
};
```

#### Sign In
```javascript
const signIn = async (email, password) => {
  try {
    const result = await authService.signIn(email, password);
    return result;
  } catch (error) {
    console.error('Sign in error:', error);
  }
};
```

#### Auth State Management
```javascript
// Listen to authentication state changes
const { data: authListener } = authService.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Handle user sign in
  } else if (event === 'SIGNED_OUT') {
    // Handle user sign out
  }
});
```

## User Management

### User Profile Operations

#### Get User Profile
```javascript
import { userService } from '../services/supabaseService';

const getUserProfile = async (userId) => {
  try {
    const profile = await userService.getProfile(userId);
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};
```

#### Update User Profile
```javascript
const updateUserProfile = async (userId, updates) => {
  try {
    const updatedProfile = await userService.updateProfile(userId, {
      virtual_balance: updates.virtualBalance,
      subscription_tier: updates.subscriptionTier,
      tutorial_progress: updates.tutorialProgress,
      preferences: updates.preferences
    });
    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};
```

### User Data Model
```typescript
interface User {
  user_id: string;
  username: string;
  email: string;
  subscription_tier: 'free' | 'premium' | 'pro';
  virtual_balance: number;
  created_at: string;
  updated_at: string;
  tutorial_progress: Record<string, any>;
  preferences: Record<string, any>;
  stripe_customer_id?: string;
  subscription_status: string;
  subscription_end_date?: string;
}
```

## Trading Operations

### Trade Management

#### Create Trade
```javascript
import { tradingService } from '../services/supabaseService';

const createTrade = async (tradeData) => {
  try {
    const trade = await tradingService.createTrade({
      user_id: tradeData.userId,
      symbol: tradeData.symbol,
      type: tradeData.type, // 'buy' or 'sell'
      quantity: tradeData.quantity,
      entry_price: tradeData.entryPrice,
      timestamp: new Date().toISOString(),
      status: 'open'
    });
    return trade;
  } catch (error) {
    console.error('Error creating trade:', error);
  }
};
```

#### Get User Trades
```javascript
const getUserTrades = async (userId, limit = 50) => {
  try {
    const trades = await tradingService.getUserTrades(userId, limit);
    return trades;
  } catch (error) {
    console.error('Error fetching trades:', error);
  }
};
```

#### Update Trade (Close Position)
```javascript
const closeTrade = async (tradeId, exitPrice, profitLoss) => {
  try {
    const updatedTrade = await tradingService.updateTrade(tradeId, {
      exit_price: exitPrice,
      profit_loss: profitLoss,
      status: 'closed'
    });
    return updatedTrade;
  } catch (error) {
    console.error('Error closing trade:', error);
  }
};
```

### Trade Data Model
```typescript
interface Trade {
  trade_id: string;
  user_id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  entry_price: number;
  exit_price?: number;
  profit_loss: number;
  timestamp: string;
  status: 'open' | 'closed';
  feedback?: Record<string, any>;
  scenario_id?: string;
  created_at: string;
}
```

## Scenarios & Tutorials

### Scenario Management

#### Get Available Scenarios
```javascript
import { scenarioService } from '../services/supabaseService';

const getScenarios = async () => {
  try {
    const scenarios = await scenarioService.getScenarios();
    return scenarios;
  } catch (error) {
    console.error('Error fetching scenarios:', error);
  }
};
```

#### Start Scenario
```javascript
const startScenario = async (userId, scenarioId) => {
  try {
    const userScenario = await scenarioService.startScenario(userId, scenarioId);
    return userScenario;
  } catch (error) {
    console.error('Error starting scenario:', error);
  }
};
```

#### Complete Scenario
```javascript
const completeScenario = async (userId, scenarioId, score, completionTime) => {
  try {
    const result = await scenarioService.completeScenario(
      userId, 
      scenarioId, 
      score, 
      completionTime
    );
    return result;
  } catch (error) {
    console.error('Error completing scenario:', error);
  }
};
```

### Tutorial Management

#### Get Contextual Tutorials
```javascript
import { tutorialService } from '../services/supabaseService';

const getContextualTutorials = async (triggerEvent, userTier = 'free') => {
  try {
    const tutorials = await tutorialService.getContextualTutorials(
      triggerEvent, 
      userTier
    );
    return tutorials;
  } catch (error) {
    console.error('Error fetching tutorials:', error);
  }
};
```

#### Update Tutorial Progress
```javascript
const updateTutorialProgress = async (userId, tutorialId, progress) => {
  try {
    const result = await tutorialService.updateTutorialProgress(
      userId, 
      tutorialId, 
      progress
    );
    return result;
  } catch (error) {
    console.error('Error updating tutorial progress:', error);
  }
};
```

## Market Data

### Market Data Service

#### Get Market Data
```javascript
import { marketService } from '../services/supabaseService';

const getMarketData = async (symbols = []) => {
  try {
    const marketData = await marketService.getMarketData(symbols);
    return marketData;
  } catch (error) {
    console.error('Error fetching market data:', error);
  }
};
```

#### Market Data Model
```typescript
interface MarketData {
  symbol: string;
  price: number;
  open_price: number;
  high_price: number;
  low_price: number;
  volume: number;
  change_amount: number;
  change_percent: number;
  last_updated: string;
}
```

## Analytics & Feedback

### AI Feedback Integration

#### OpenAI Service
```javascript
import { getAIFeedback } from '../utils/aiService';

const generateTradeFeedback = async (trade, marketData) => {
  try {
    const feedback = await getAIFeedback(trade, marketData);
    return feedback;
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    // Falls back to mock feedback automatically
  }
};
```

#### AI Feedback Response Model
```typescript
interface AIFeedback {
  type: 'positive' | 'neutral' | 'negative';
  analysis: string;
  suggestions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  marketCondition: string;
  confidence: number; // 70-100
}
```

### Analytics Service

#### Get User Analytics
```javascript
import { analyticsService } from '../services/supabaseService';

const getUserAnalytics = async (userId, timeframe = '30d') => {
  try {
    const analytics = await analyticsService.getUserAnalytics(userId, timeframe);
    return analytics;
  } catch (error) {
    console.error('Error fetching analytics:', error);
  }
};
```

#### Submit Feedback
```javascript
const submitFeedback = async (tradeId, feedbackType, userRating, userFeedback) => {
  try {
    const result = await analyticsService.submitFeedback(
      tradeId, 
      feedbackType, 
      userRating, 
      userFeedback
    );
    return result;
  } catch (error) {
    console.error('Error submitting feedback:', error);
  }
};
```

## Subscription Management

### Stripe Integration

#### Create Checkout Session
```javascript
import stripeService, { SUBSCRIPTION_PLANS } from '../services/stripeService';

const upgradeSubscription = async (planId, customerId) => {
  try {
    const plan = SUBSCRIPTION_PLANS[planId];
    await stripeService.createCheckoutSession(
      plan.priceId,
      customerId,
      `${window.location.origin}/success`,
      `${window.location.origin}/cancel`
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
  }
};
```

#### Manage Subscription
```javascript
const openCustomerPortal = async (customerId) => {
  try {
    await stripeService.createPortalSession(
      customerId,
      window.location.href
    );
  } catch (error) {
    console.error('Error opening customer portal:', error);
  }
};
```

#### Get Subscription Status
```javascript
const getSubscriptionStatus = async (customerId) => {
  try {
    const status = await stripeService.getSubscriptionStatus(customerId);
    return status;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
  }
};
```

### Subscription Plans
```typescript
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
  limitations?: string[];
}
```

## Real-time Features

### Real-time Subscriptions

#### Market Data Updates
```javascript
import { realtimeService } from '../services/supabaseService';

const subscribeToMarketData = (callback) => {
  const subscription = realtimeService.subscribeToMarketData((payload) => {
    console.log('Market data updated:', payload);
    callback(payload.new);
  });
  
  return subscription;
};
```

#### User Trade Updates
```javascript
const subscribeToUserTrades = (userId, callback) => {
  const subscription = realtimeService.subscribeToUserTrades(userId, (payload) => {
    console.log('Trade updated:', payload);
    callback(payload);
  });
  
  return subscription;
};
```

#### Cleanup Subscriptions
```javascript
const cleanup = (subscription) => {
  realtimeService.unsubscribe(subscription);
};
```

## Error Handling

### Standard Error Response
```typescript
interface APIError {
  message: string;
  code: string;
  details?: any;
}
```

### Error Handling Pattern
```javascript
const handleAPICall = async (apiFunction) => {
  try {
    const result = await apiFunction();
    return { success: true, data: result };
  } catch (error) {
    console.error('API Error:', error);
    return { 
      success: false, 
      error: {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        details: error.details
      }
    };
  }
};
```

## Environment Variables

### Required Environment Variables
```bash
# OpenAI Integration
VITE_OPENAI_API_KEY=your_openai_api_key

# Supabase Integration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Integration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_PREMIUM_PRICE_ID=price_premium_monthly
VITE_STRIPE_PRO_PRICE_ID=price_pro_monthly
```

### Development vs Production
- Development: Uses mock services when API keys are not provided
- Production: Requires all API keys for full functionality

## Rate Limits & Quotas

### OpenAI API
- Rate limit: 3 requests per minute for free tier
- Token limit: 4,000 tokens per request
- Fallback: Mock AI service when limits exceeded

### Supabase
- Free tier: 500MB database, 2GB bandwidth
- Real-time: 200 concurrent connections
- API requests: 50,000 per month

### Stripe
- Test mode: Unlimited requests
- Live mode: Based on subscription volume

## Security Considerations

### Row Level Security (RLS)
- All user data protected by RLS policies
- Users can only access their own data
- Public data (scenarios, tutorials) accessible to all

### API Key Security
- Client-side API keys are public by design
- Server-side operations require secure keys
- Environment variables never committed to version control

### Data Validation
- All inputs validated on both client and server
- SQL injection protection via parameterized queries
- XSS protection via input sanitization

## Testing

### API Testing
```javascript
// Example test for trade creation
describe('Trading API', () => {
  test('should create trade successfully', async () => {
    const tradeData = {
      userId: 'test-user-id',
      symbol: 'AAPL',
      type: 'buy',
      quantity: 10,
      entryPrice: 150.00
    };
    
    const result = await tradingService.createTrade(tradeData);
    expect(result.trade_id).toBeDefined();
    expect(result.symbol).toBe('AAPL');
  });
});
```

### Mock Data for Testing
```javascript
// Mock trade data
export const mockTrade = {
  trade_id: 'test-trade-123',
  user_id: 'test-user-456',
  symbol: 'AAPL',
  type: 'buy',
  quantity: 10,
  entry_price: 150.00,
  status: 'open',
  timestamp: '2024-01-01T10:00:00Z'
};
```

## Deployment

### Database Setup
1. Run the schema.sql file in Supabase SQL editor
2. Configure RLS policies
3. Set up real-time subscriptions
4. Insert sample data

### Environment Configuration
1. Set all required environment variables
2. Configure Stripe webhooks for production
3. Set up OpenAI API key with appropriate limits
4. Configure Supabase project settings

### Monitoring
- Monitor API usage and rate limits
- Track user engagement metrics
- Monitor subscription conversion rates
- Set up error tracking and alerting

This documentation provides a comprehensive guide to all API integrations and services used in SimuTrade, following the specifications outlined in the PRD.
