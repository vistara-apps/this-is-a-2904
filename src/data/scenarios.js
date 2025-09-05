// Enhanced practice scenarios for SimuTrade
// These scenarios provide guided learning experiences for different trading situations

export const PRACTICE_SCENARIOS = [
  {
    id: 'market-crash',
    title: 'Market Crash Response',
    description: 'Learn how to react during a sudden market downturn. Practice protective strategies and risk management.',
    difficulty: 'Advanced',
    estimatedTime: 15,
    category: 'Risk Management',
    isPremium: false,
    icon: 'TrendingDown',
    marketEvent: 'Market drops 10% in 30 minutes due to unexpected economic news',
    initialConditions: {
      marketVolatility: 'high',
      sentiment: 'fear',
      vixLevel: 35,
      portfolioValue: 10000,
      openPositions: [
        { symbol: 'AAPL', quantity: 50, entryPrice: 150, currentPrice: 135 },
        { symbol: 'TSLA', quantity: 20, entryPrice: 250, currentPrice: 220 }
      ]
    },
    steps: [
      {
        id: 1,
        title: 'Assess the Situation',
        description: 'Market has dropped 10% suddenly. Review your portfolio exposure and current positions.',
        instruction: 'Analyze your open positions and calculate your unrealized losses.',
        expectedAction: 'portfolio_review',
        hints: [
          'Check the correlation between your positions',
          'Calculate your total exposure to the market',
          'Identify which positions are most at risk'
        ],
        successCriteria: {
          timeLimit: 120, // 2 minutes
          requiredActions: ['view_portfolio', 'calculate_losses']
        }
      },
      {
        id: 2,
        title: 'Decision Point',
        description: 'You have three main options: Hold and wait, hedge your positions, or cut losses.',
        instruction: 'Choose your strategy based on your risk tolerance and market analysis.',
        expectedAction: 'strategy_selection',
        options: [
          {
            id: 'hold',
            title: 'Hold Positions',
            description: 'Maintain current positions and wait for recovery',
            riskLevel: 'high',
            expectedOutcome: 'Potential for recovery but risk of further losses'
          },
          {
            id: 'hedge',
            title: 'Hedge Portfolio',
            description: 'Buy protective puts or sell index futures to limit downside',
            riskLevel: 'medium',
            expectedOutcome: 'Limited downside but also limited upside'
          },
          {
            id: 'cut_losses',
            title: 'Cut Losses',
            description: 'Sell positions to preserve capital',
            riskLevel: 'low',
            expectedOutcome: 'Preserve capital but miss potential recovery'
          }
        ]
      },
      {
        id: 3,
        title: 'Execute Strategy',
        description: 'Implement your chosen strategy quickly and efficiently.',
        instruction: 'Execute your trades based on your decision.',
        expectedAction: 'trade_execution',
        timeLimit: 180 // 3 minutes
      },
      {
        id: 4,
        title: 'Monitor and Adjust',
        description: 'Watch how the market reacts and be prepared to adjust your strategy.',
        instruction: 'Monitor your positions and market conditions for the next 10 minutes.',
        expectedAction: 'monitoring',
        marketUpdates: [
          { time: 2, event: 'Market continues to decline, down 12%' },
          { time: 5, event: 'Central bank announces emergency measures' },
          { time: 8, event: 'Market starts to stabilize, down 8%' }
        ]
      },
      {
        id: 5,
        title: 'Review and Learn',
        description: 'Analyze the outcome of your decisions and identify lessons learned.',
        instruction: 'Review your performance and document key takeaways.',
        expectedAction: 'reflection',
        questions: [
          'How did your strategy perform?',
          'What would you do differently?',
          'What risk management lessons did you learn?'
        ]
      }
    ],
    learningObjectives: [
      'Understand how to react quickly to market crashes',
      'Learn different hedging strategies',
      'Practice risk management under pressure',
      'Develop emotional discipline during market stress'
    ],
    keyTakeaways: [
      'Having a pre-planned crisis strategy is crucial',
      'Diversification helps but doesn\'t eliminate all risk',
      'Emotional decisions often lead to poor outcomes',
      'Risk management is more important than profit maximization'
    ]
  },
  {
    id: 'earnings-announcement',
    title: 'Earnings Announcement Trading',
    description: 'Navigate the volatility and opportunities around quarterly earnings releases.',
    difficulty: 'Intermediate',
    estimatedTime: 10,
    category: 'Event Trading',
    isPremium: false,
    icon: 'TrendingUp',
    marketEvent: 'AAPL announces earnings in 1 hour, expectations are high',
    initialConditions: {
      symbol: 'AAPL',
      currentPrice: 150,
      expectedMove: 5, // Expected 5% move post-earnings
      impliedVolatility: 45,
      timeToEarnings: 60, // minutes
      analystConsensus: {
        eps: 1.25,
        revenue: 89.5, // billions
        guidance: 'positive'
      }
    },
    steps: [
      {
        id: 1,
        title: 'Pre-Earnings Analysis',
        description: 'Research the company and analyst expectations before the announcement.',
        instruction: 'Review analyst estimates, recent news, and technical indicators.',
        expectedAction: 'research',
        timeLimit: 300, // 5 minutes
        resources: [
          'Analyst consensus data',
          'Recent company news',
          'Technical chart analysis',
          'Options flow data'
        ]
      },
      {
        id: 2,
        title: 'Strategy Selection',
        description: 'Choose how to position yourself for the earnings announcement.',
        instruction: 'Select your trading strategy based on your analysis.',
        expectedAction: 'strategy_selection',
        options: [
          {
            id: 'long_stock',
            title: 'Buy Stock',
            description: 'Purchase shares expecting positive earnings',
            riskLevel: 'medium',
            capitalRequired: 'high'
          },
          {
            id: 'long_calls',
            title: 'Buy Call Options',
            description: 'Purchase call options for leveraged upside',
            riskLevel: 'high',
            capitalRequired: 'medium'
          },
          {
            id: 'straddle',
            title: 'Long Straddle',
            description: 'Buy both calls and puts to profit from volatility',
            riskLevel: 'medium',
            capitalRequired: 'high'
          },
          {
            id: 'stay_out',
            title: 'Stay Neutral',
            description: 'Avoid the trade due to high uncertainty',
            riskLevel: 'low',
            capitalRequired: 'none'
          }
        ]
      },
      {
        id: 3,
        title: 'Position Entry',
        description: 'Execute your chosen strategy before the earnings announcement.',
        instruction: 'Enter your position with appropriate position sizing.',
        expectedAction: 'trade_execution',
        timeLimit: 120,
        considerations: [
          'Position size relative to portfolio',
          'Entry timing',
          'Stop loss levels'
        ]
      },
      {
        id: 4,
        title: 'Earnings Release',
        description: 'The company announces earnings results.',
        instruction: 'React to the earnings announcement and market response.',
        expectedAction: 'reaction',
        earningsResults: {
          eps: 1.30, // Beat by $0.05
          revenue: 91.2, // Beat by $1.7B
          guidance: 'raised',
          initialReaction: '+8%' // Stock jumps 8% after hours
        }
      },
      {
        id: 5,
        title: 'Post-Earnings Management',
        description: 'Manage your position based on the earnings outcome.',
        instruction: 'Decide whether to hold, take profits, or cut losses.',
        expectedAction: 'position_management',
        marketBehavior: 'Stock continues to rise in after-hours trading',
        timeLimit: 180
      }
    ],
    learningObjectives: [
      'Understand earnings announcement dynamics',
      'Learn different earnings trading strategies',
      'Practice position sizing for event trades',
      'Develop skills in managing volatility'
    ]
  },
  {
    id: 'breakout-trading',
    title: 'Breakout Trading Strategy',
    description: 'Learn to identify and trade technical breakouts from key resistance levels.',
    difficulty: 'Intermediate',
    estimatedTime: 12,
    category: 'Technical Analysis',
    isPremium: true,
    icon: 'BarChart3',
    marketEvent: 'TSLA approaches key resistance level at $250 with high volume',
    initialConditions: {
      symbol: 'TSLA',
      currentPrice: 248.50,
      resistanceLevel: 250,
      supportLevel: 240,
      volume: 'above_average',
      technicalIndicators: {
        rsi: 65,
        macd: 'bullish_crossover',
        movingAverages: 'aligned_bullish'
      }
    },
    steps: [
      {
        id: 1,
        title: 'Technical Setup Recognition',
        description: 'Identify the breakout setup and confirm the technical conditions.',
        instruction: 'Analyze the chart pattern and technical indicators.',
        expectedAction: 'technical_analysis',
        timeLimit: 240,
        checkpoints: [
          'Identify resistance level',
          'Confirm volume pattern',
          'Check momentum indicators',
          'Assess risk/reward ratio'
        ]
      },
      {
        id: 2,
        title: 'Entry Strategy',
        description: 'Plan your entry point and position size for the breakout trade.',
        instruction: 'Set your entry trigger and calculate position size.',
        expectedAction: 'entry_planning',
        considerations: [
          'Breakout confirmation level',
          'Stop loss placement',
          'Position sizing based on risk',
          'Target profit levels'
        ]
      },
      {
        id: 3,
        title: 'Breakout Execution',
        description: 'Execute the trade as the stock breaks through resistance.',
        instruction: 'Enter your position when breakout is confirmed.',
        expectedAction: 'trade_execution',
        marketAction: 'Stock breaks above $250 on high volume',
        timeLimit: 60
      },
      {
        id: 4,
        title: 'Trade Management',
        description: 'Manage the position as it develops.',
        instruction: 'Monitor the trade and adjust stops as needed.',
        expectedAction: 'position_management',
        priceAction: [
          { time: 1, price: 252, action: 'Continue higher' },
          { time: 3, price: 255, action: 'Strong momentum' },
          { time: 5, price: 253, action: 'Minor pullback' },
          { time: 8, price: 258, action: 'New highs' }
        ]
      }
    ],
    learningObjectives: [
      'Recognize valid breakout setups',
      'Learn proper entry and exit techniques',
      'Understand volume confirmation',
      'Practice risk management in momentum trades'
    ]
  },
  {
    id: 'news-impact-trading',
    title: 'Breaking News Impact',
    description: 'Practice trading when unexpected news hits the market and affects stock prices.',
    difficulty: 'Advanced',
    estimatedTime: 8,
    category: 'News Trading',
    isPremium: true,
    icon: 'AlertTriangle',
    marketEvent: 'FDA approves new drug for biotech company, stock gaps up 25%',
    initialConditions: {
      symbol: 'BIOTECH',
      preNewsPrice: 40,
      gapUpPrice: 50,
      newsType: 'FDA_approval',
      marketReaction: 'extremely_positive',
      volume: 'explosive'
    },
    steps: [
      {
        id: 1,
        title: 'News Assessment',
        description: 'Quickly assess the significance and impact of the breaking news.',
        instruction: 'Analyze the news and its potential market impact.',
        expectedAction: 'news_analysis',
        timeLimit: 120,
        newsDetails: {
          headline: 'FDA Approves Revolutionary Cancer Treatment',
          significance: 'Major breakthrough for rare cancer',
          marketSize: '$2.5 billion annually',
          competition: 'First-to-market advantage'
        }
      },
      {
        id: 2,
        title: 'Quick Decision Making',
        description: 'Make a rapid trading decision based on the news impact.',
        instruction: 'Decide your trading approach within 2 minutes.',
        expectedAction: 'rapid_decision',
        timeLimit: 120,
        options: [
          'Chase the gap up',
          'Wait for pullback',
          'Fade the move',
          'Stay out'
        ]
      },
      {
        id: 3,
        title: 'Execution Under Pressure',
        description: 'Execute your strategy in a fast-moving market.',
        instruction: 'Place your trades quickly and efficiently.',
        expectedAction: 'fast_execution',
        marketConditions: 'High volatility, wide spreads, fast movement'
      }
    ],
    learningObjectives: [
      'Develop quick news analysis skills',
      'Learn to trade in volatile conditions',
      'Practice rapid decision making',
      'Understand gap trading strategies'
    ]
  },
  {
    id: 'risk-management-drill',
    title: 'Risk Management Drill',
    description: 'Practice proper position sizing and risk management across multiple trades.',
    difficulty: 'Beginner',
    estimatedTime: 20,
    category: 'Risk Management',
    isPremium: false,
    icon: 'Shield',
    marketEvent: 'Multiple trading opportunities with different risk profiles',
    initialConditions: {
      accountSize: 10000,
      maxRiskPerTrade: 2, // 2% of account
      availableOpportunities: [
        { symbol: 'AAPL', setup: 'breakout', riskReward: '1:3', probability: 60 },
        { symbol: 'GOOGL', setup: 'pullback', riskReward: '1:2', probability: 70 },
        { symbol: 'TSLA', setup: 'momentum', riskReward: '1:4', probability: 45 }
      ]
    },
    steps: [
      {
        id: 1,
        title: 'Risk Assessment',
        description: 'Evaluate each trading opportunity and assess the risk.',
        instruction: 'Calculate the risk for each potential trade.',
        expectedAction: 'risk_calculation',
        timeLimit: 300
      },
      {
        id: 2,
        title: 'Position Sizing',
        description: 'Calculate appropriate position sizes based on your risk rules.',
        instruction: 'Determine position size for each trade opportunity.',
        expectedAction: 'position_sizing',
        riskRules: [
          'Maximum 2% risk per trade',
          'Maximum 6% total portfolio risk',
          'No more than 3 positions at once'
        ]
      },
      {
        id: 3,
        title: 'Portfolio Risk Management',
        description: 'Manage overall portfolio risk across multiple positions.',
        instruction: 'Monitor and adjust total portfolio exposure.',
        expectedAction: 'portfolio_management',
        scenarios: [
          'All trades move against you',
          'Mixed results across positions',
          'Strong correlation between positions'
        ]
      }
    ],
    learningObjectives: [
      'Master position sizing calculations',
      'Understand portfolio-level risk management',
      'Learn to balance multiple positions',
      'Develop disciplined risk practices'
    ]
  },
  {
    id: 'options-basics',
    title: 'Options Trading Fundamentals',
    description: 'Learn the basics of options trading with practical examples.',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    category: 'Options',
    isPremium: true,
    icon: 'Settings',
    marketEvent: 'Practice basic options strategies with different market scenarios',
    initialConditions: {
      underlyingStock: 'SPY',
      currentPrice: 400,
      impliedVolatility: 20,
      timeToExpiration: 30, // days
      interestRate: 5
    },
    steps: [
      {
        id: 1,
        title: 'Options Basics',
        description: 'Understand calls, puts, and basic options terminology.',
        instruction: 'Learn the fundamentals of options contracts.',
        expectedAction: 'education',
        concepts: [
          'Call vs Put options',
          'Strike price and expiration',
          'Intrinsic vs time value',
          'The Greeks (Delta, Gamma, Theta, Vega)'
        ]
      },
      {
        id: 2,
        title: 'Simple Strategies',
        description: 'Practice basic options strategies.',
        instruction: 'Execute simple long call and put trades.',
        expectedAction: 'strategy_practice',
        strategies: [
          'Long Call (bullish)',
          'Long Put (bearish)',
          'Covered Call (income)',
          'Protective Put (insurance)'
        ]
      },
      {
        id: 3,
        title: 'Risk and Reward Analysis',
        description: 'Analyze the risk/reward profile of options trades.',
        instruction: 'Calculate maximum profit, loss, and breakeven points.',
        expectedAction: 'analysis',
        calculations: [
          'Maximum profit potential',
          'Maximum loss exposure',
          'Breakeven price levels',
          'Probability of profit'
        ]
      }
    ],
    learningObjectives: [
      'Understand options fundamentals',
      'Learn basic options strategies',
      'Practice risk/reward analysis',
      'Develop options trading skills'
    ]
  }
];

// Scenario categories for filtering
export const SCENARIO_CATEGORIES = [
  'Risk Management',
  'Technical Analysis',
  'Event Trading',
  'News Trading',
  'Options',
  'Psychology'
];

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

// Helper functions
export const getScenariosByCategory = (category) => {
  return PRACTICE_SCENARIOS.filter(scenario => scenario.category === category);
};

export const getScenariosByDifficulty = (difficulty) => {
  return PRACTICE_SCENARIOS.filter(scenario => scenario.difficulty === difficulty);
};

export const getFreeScenarios = () => {
  return PRACTICE_SCENARIOS.filter(scenario => !scenario.isPremium);
};

export const getPremiumScenarios = () => {
  return PRACTICE_SCENARIOS.filter(scenario => scenario.isPremium);
};
