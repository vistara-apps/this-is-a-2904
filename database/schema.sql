-- SimuTrade Database Schema for Supabase
-- This file contains the complete database schema as specified in the PRD

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
    virtual_balance DECIMAL(12, 2) DEFAULT 10000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tutorial_progress JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    stripe_customer_id VARCHAR(255),
    subscription_status VARCHAR(20) DEFAULT 'inactive',
    subscription_end_date TIMESTAMP WITH TIME ZONE
);

-- Trades table
CREATE TABLE trades (
    trade_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    symbol VARCHAR(10) NOT NULL,
    type VARCHAR(4) NOT NULL CHECK (type IN ('buy', 'sell')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    entry_price DECIMAL(10, 4) NOT NULL,
    exit_price DECIMAL(10, 4),
    profit_loss DECIMAL(12, 2) DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(10) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    feedback JSONB,
    scenario_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenarios table
CREATE TABLE scenarios (
    scenario_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_time INTEGER, -- in minutes
    market_event TEXT,
    guide_steps JSONB,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User scenario completions
CREATE TABLE user_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    scenario_id UUID REFERENCES scenarios(scenario_id) ON DELETE CASCADE,
    completion_status VARCHAR(20) DEFAULT 'not_started' CHECK (completion_status IN ('not_started', 'in_progress', 'completed')),
    score INTEGER,
    completion_time INTEGER, -- in seconds
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, scenario_id)
);

-- Tutorials table
CREATE TABLE tutorials (
    tutorial_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content_url TEXT,
    content_type VARCHAR(20) CHECK (content_type IN ('video', 'text', 'interactive')),
    trigger_event VARCHAR(100),
    category VARCHAR(50),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration INTEGER, -- in minutes
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User tutorial progress
CREATE TABLE user_tutorials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    tutorial_id UUID REFERENCES tutorials(tutorial_id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tutorial_id)
);

-- Market data cache (for performance)
CREATE TABLE market_data (
    symbol VARCHAR(10) PRIMARY KEY,
    price DECIMAL(10, 4) NOT NULL,
    open_price DECIMAL(10, 4) NOT NULL,
    high_price DECIMAL(10, 4) NOT NULL,
    low_price DECIMAL(10, 4) NOT NULL,
    volume BIGINT DEFAULT 0,
    change_amount DECIMAL(10, 4) DEFAULT 0,
    change_percent DECIMAL(8, 4) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for analytics
CREATE TABLE user_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    trades_count INTEGER DEFAULT 0,
    scenarios_completed INTEGER DEFAULT 0,
    tutorials_viewed INTEGER DEFAULT 0
);

-- Feedback analytics
CREATE TABLE feedback_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trade_id UUID REFERENCES trades(trade_id) ON DELETE CASCADE,
    feedback_type VARCHAR(20),
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_trades_timestamp ON trades(timestamp);
CREATE INDEX idx_user_scenarios_user_id ON user_scenarios(user_id);
CREATE INDEX idx_user_tutorials_user_id ON user_tutorials(user_id);
CREATE INDEX idx_market_data_symbol ON market_data(symbol);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON scenarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorials_updated_at BEFORE UPDATE ON tutorials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = user_id);

-- Trades policies
CREATE POLICY "Users can view own trades" ON trades
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" ON trades
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" ON trades
    FOR UPDATE USING (auth.uid() = user_id);

-- User scenarios policies
CREATE POLICY "Users can view own scenarios" ON user_scenarios
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scenarios" ON user_scenarios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scenarios" ON user_scenarios
    FOR UPDATE USING (auth.uid() = user_id);

-- User tutorials policies
CREATE POLICY "Users can view own tutorials" ON user_tutorials
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tutorials" ON user_tutorials
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tutorials" ON user_tutorials
    FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for scenarios and tutorials
CREATE POLICY "Anyone can view scenarios" ON scenarios FOR SELECT USING (true);
CREATE POLICY "Anyone can view tutorials" ON tutorials FOR SELECT USING (true);

-- Market data is publicly readable
CREATE POLICY "Anyone can view market data" ON market_data FOR SELECT USING (true);

-- Insert sample data
INSERT INTO scenarios (title, description, difficulty, estimated_time, market_event, guide_steps, is_premium) VALUES
('Market Crash Response', 'Learn how to react during a sudden market downturn. Practice protective strategies.', 'advanced', 15, 'Market drops 10% in 30 minutes', '["Market drops 10% in 30 minutes", "Analyze your portfolio exposure", "Decide: Hold, hedge, or sell?", "Execute your chosen strategy", "Review the outcome"]', false),
('Earnings Announcement', 'Navigate trading around earnings releases. Learn about volatility and timing.', 'intermediate', 10, 'Company announces earnings in 1 hour', '["Company announces earnings in 1 hour", "Review analyst expectations", "Consider pre-earnings position", "Manage trade through announcement", "Analyze post-earnings movement"]', false),
('Breaking News Impact', 'Practice trading when unexpected news hits the market.', 'intermediate', 12, 'Breaking news affects sector', '["Breaking news released", "Assess news impact", "Identify affected stocks", "Execute quick decision", "Monitor market reaction"]', true),
('Volatility Spike', 'Handle extreme market volatility and protect your portfolio.', 'advanced', 20, 'VIX spikes above 30', '["Volatility warning triggered", "Review open positions", "Implement hedging strategy", "Adjust position sizes", "Wait for stabilization"]', true);

INSERT INTO tutorials (title, content_url, content_type, trigger_event, category, difficulty, duration, is_premium) VALUES
('Understanding Market Orders', '/tutorials/market-orders', 'interactive', 'first_trade', 'basics', 'beginner', 3, false),
('Reading Stock Charts', '/tutorials/chart-reading', 'video', 'chart_view', 'basics', 'beginner', 5, false),
('Risk Management Fundamentals', '/tutorials/risk-management', 'text', 'large_position', 'risk', 'intermediate', 4, true),
('Day Trading Basics', '/tutorials/day-trading', 'video', 'multiple_trades', 'strategies', 'intermediate', 8, true),
('Options Trading Introduction', '/tutorials/options-basics', 'interactive', 'advanced_features', 'advanced', 'advanced', 12, true);

INSERT INTO market_data (symbol, price, open_price, high_price, low_price, volume) VALUES
('AAPL', 150.25, 149.80, 151.20, 149.50, 25000000),
('GOOGL', 2750.50, 2745.00, 2760.00, 2740.00, 1200000),
('MSFT', 310.75, 309.50, 312.00, 308.80, 18000000),
('TSLA', 245.30, 242.00, 248.50, 241.75, 35000000),
('AMZN', 3200.80, 3195.00, 3210.00, 3190.50, 2800000),
('META', 325.60, 323.20, 327.80, 322.50, 15000000),
('NVDA', 450.90, 448.00, 455.20, 447.30, 22000000),
('NFLX', 385.40, 383.50, 388.00, 382.80, 8500000);
