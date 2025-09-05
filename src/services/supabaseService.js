import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// User Management
export const userService = {
  // Get user profile
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create user profile (called after auth signup)
  async createProfile(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Trading Management
export const tradingService = {
  // Get user's trades
  async getUserTrades(userId, limit = 50) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Create new trade
  async createTrade(tradeData) {
    const { data, error } = await supabase
      .from('trades')
      .insert([tradeData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update trade (for closing positions)
  async updateTrade(tradeId, updates) {
    const { data, error } = await supabase
      .from('trades')
      .update(updates)
      .eq('trade_id', tradeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get trade analytics
  async getTradeAnalytics(userId, timeframe = '30d') {
    const { data, error } = await supabase
      .rpc('get_trade_analytics', {
        user_id: userId,
        timeframe: timeframe
      });
    
    if (error) throw error;
    return data;
  }
};

// Scenario Management
export const scenarioService = {
  // Get all scenarios
  async getScenarios() {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get user's scenario progress
  async getUserScenarios(userId) {
    const { data, error } = await supabase
      .from('user_scenarios')
      .select(`
        *,
        scenarios (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  // Start scenario
  async startScenario(userId, scenarioId) {
    const { data, error } = await supabase
      .from('user_scenarios')
      .upsert([{
        user_id: userId,
        scenario_id: scenarioId,
        completion_status: 'in_progress'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Complete scenario
  async completeScenario(userId, scenarioId, score, completionTime) {
    const { data, error } = await supabase
      .from('user_scenarios')
      .update({
        completion_status: 'completed',
        score: score,
        completion_time: completionTime,
        completed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('scenario_id', scenarioId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Tutorial Management
export const tutorialService = {
  // Get all tutorials
  async getTutorials() {
    const { data, error } = await supabase
      .from('tutorials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get user's tutorial progress
  async getUserTutorials(userId) {
    const { data, error } = await supabase
      .from('user_tutorials')
      .select(`
        *,
        tutorials (*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  // Update tutorial progress
  async updateTutorialProgress(userId, tutorialId, progress) {
    const { data, error } = await supabase
      .from('user_tutorials')
      .upsert([{
        user_id: userId,
        tutorial_id: tutorialId,
        progress: progress,
        completed: progress >= 100,
        completed_at: progress >= 100 ? new Date().toISOString() : null
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get contextual tutorials based on trigger event
  async getContextualTutorials(triggerEvent, userTier = 'free') {
    let query = supabase
      .from('tutorials')
      .select('*')
      .eq('trigger_event', triggerEvent);
    
    if (userTier === 'free') {
      query = query.eq('is_premium', false);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
};

// Market Data Management
export const marketService = {
  // Get market data for symbols
  async getMarketData(symbols = []) {
    let query = supabase
      .from('market_data')
      .select('*');
    
    if (symbols.length > 0) {
      query = query.in('symbol', symbols);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  // Update market data (admin function)
  async updateMarketData(marketData) {
    const { data, error } = await supabase
      .from('market_data')
      .upsert(marketData)
      .select();
    
    if (error) throw error;
    return data;
  }
};

// Analytics and Feedback
export const analyticsService = {
  // Create user session
  async createSession(userId) {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert([{ user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update session stats
  async updateSession(sessionId, stats) {
    const { data, error } = await supabase
      .from('user_sessions')
      .update({
        ...stats,
        ended_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Submit feedback
  async submitFeedback(tradeId, feedbackType, userRating, userFeedback) {
    const { data, error } = await supabase
      .from('feedback_analytics')
      .insert([{
        trade_id: tradeId,
        feedback_type: feedbackType,
        user_rating: userRating,
        user_feedback: userFeedback
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user analytics dashboard data
  async getUserAnalytics(userId, timeframe = '30d') {
    const { data, error } = await supabase
      .rpc('get_user_analytics', {
        user_id: userId,
        timeframe: timeframe
      });
    
    if (error) throw error;
    return data;
  }
};

// Authentication helpers
export const authService = {
  // Sign up with email
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    
    // Create user profile
    if (data.user) {
      await userService.createProfile({
        user_id: data.user.id,
        email: data.user.email,
        username: userData.username,
        subscription_tier: 'free',
        virtual_balance: 10000.00
      });
    }
    
    return data;
  },

  // Sign in with email
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to market data updates
  subscribeToMarketData(callback) {
    return supabase
      .channel('market_data_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'market_data'
      }, callback)
      .subscribe();
  },

  // Subscribe to user's trade updates
  subscribeToUserTrades(userId, callback) {
    return supabase
      .channel(`user_trades_${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trades',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe(subscription) {
    return supabase.removeChannel(subscription);
  }
};

export default supabase;
