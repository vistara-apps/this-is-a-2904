# SimuTrade - Master Trading, Risk-Free

![SimuTrade Logo](https://via.placeholder.com/800x200/3B82F6/FFFFFF?text=SimuTrade)

**Master trading, risk-free. Practice strategies and get instant feedback.**

SimuTrade is a comprehensive web application that empowers aspiring traders to learn and practice trading strategies in a risk-free environment using virtual currency while receiving instant AI-powered feedback.

## 🚀 Features

### Core Features

- **🎯 Simulated Trading Environment**: Virtual trading platform with real-time market data simulation
- **🤖 Instant AI Feedback**: AI-powered analysis of your trades with actionable insights
- **📚 Guided Practice Scenarios**: Interactive modules for specific market events and situations
- **🎓 Contextual Tutorials**: Just-in-time educational content triggered by your actions
- **📊 Advanced Analytics**: Comprehensive trading performance analysis and metrics
- **💳 Subscription Management**: Tiered access with Stripe integration

### Key Benefits

- **Zero Risk**: Practice with virtual currency - no real money at stake
- **Real-time Learning**: Get immediate feedback on every trade decision
- **Structured Learning**: Progress through guided scenarios and tutorials
- **Performance Tracking**: Monitor your improvement with detailed analytics
- **Professional Tools**: Experience realistic trading interface and tools

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Lucide React** - Beautiful icons

### Backend & Services
- **Supabase** - Backend-as-a-Service (Database, Auth, Real-time)
- **OpenAI API** - AI-powered trade feedback
- **Stripe** - Payment processing and subscription management

### Development Tools
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Docker** - Containerization

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser
- API keys for external services (optional for demo mode)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/this-is-a-2904.git
cd this-is-a-2904
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your API keys:
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
# OpenAI API Key (optional - falls back to mock service)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration (optional - uses localStorage for demo)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (optional - uses mock service for demo)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_PREMIUM_PRICE_ID=price_premium_monthly
VITE_STRIPE_PRO_PRICE_ID=price_pro_monthly
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application running.

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── AnalyticsDashboard.jsx
│   ├── AuthModal.jsx
│   ├── Chart.jsx
│   ├── FeedbackCard.jsx
│   ├── Header.jsx
│   ├── ScenarioPanel.jsx
│   ├── SubscriptionModal.jsx
│   ├── TradeForm.jsx
│   ├── TradingDashboard.jsx
│   ├── TutorialModal.jsx
│   └── ...
├── context/             # React context providers
│   ├── AuthContext.jsx
│   ├── TradingContext.jsx
│   ├── MarketContext.jsx
│   └── UserContext.jsx
├── services/            # API service layers
│   ├── supabaseService.js
│   └── stripeService.js
├── utils/               # Utility functions
│   ├── aiService.js
│   ├── marketData.js
│   └── marketSimulator.js
├── data/                # Static data and configurations
│   └── scenarios.js
└── stores/              # State management
    ├── tradingStore.js
    └── userStore.js

database/                # Database schema and migrations
├── schema.sql

docs/                    # Documentation
├── API_DOCUMENTATION.md
└── ...
```

## 🎮 Usage Guide

### Getting Started

1. **Sign Up**: Create a free account to start trading
2. **Virtual Balance**: Start with $10,000 in virtual currency
3. **First Trade**: Place your first trade and receive AI feedback
4. **Explore Scenarios**: Try guided practice scenarios
5. **Learn**: Access contextual tutorials as you trade

### Trading Interface

- **Market Overview**: Real-time price data for major stocks
- **Trade Form**: Execute buy/sell orders with position sizing
- **Portfolio**: Track your positions and performance
- **Feedback Panel**: Receive AI analysis of your trades
- **Analytics**: View detailed performance metrics

### Practice Scenarios

- **Market Crash Response**: Learn crisis management
- **Earnings Trading**: Navigate earnings announcements
- **Breakout Trading**: Master technical analysis
- **Risk Management**: Practice position sizing
- **Options Basics**: Learn options fundamentals

## 💰 Subscription Plans

### Free Tier
- 10 trades per day
- Basic AI feedback
- Limited practice scenarios
- Community support

### Premium ($15/month)
- Unlimited trades
- Advanced AI feedback
- All practice scenarios
- Detailed analytics
- Priority support

### Pro ($30/month)
- Everything in Premium
- Personalized AI coaching
- Advanced market scenarios
- Custom trading strategies
- One-on-one mentoring

## 🔧 Configuration

### Database Setup (Supabase)

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql`
3. Configure Row Level Security policies
4. Set up real-time subscriptions
5. Add your Supabase URL and anon key to `.env`

### AI Integration (OpenAI)

1. Get an OpenAI API key
2. Add it to your `.env` file
3. The app will automatically use real AI feedback
4. Falls back to mock service if no key provided

### Payment Processing (Stripe)

1. Create a Stripe account
2. Set up subscription products and prices
3. Add publishable key and price IDs to `.env`
4. Configure webhooks for production

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Docker Deployment
```bash
# Build the Docker image
docker build -t simutrade .

# Run the container
docker run -p 3000:3000 simutrade
```

### Environment Variables for Production
Ensure all required environment variables are set:
- `VITE_OPENAI_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_STRIPE_PREMIUM_PRICE_ID`
- `VITE_STRIPE_PRO_PRICE_ID`

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### E2E Testing
```bash
npm run test:e2e
```

## 📊 Analytics & Monitoring

### Key Metrics Tracked
- User engagement and retention
- Trading activity and patterns
- Subscription conversion rates
- AI feedback effectiveness
- Scenario completion rates

### Performance Monitoring
- API response times
- Error rates and types
- User session duration
- Feature usage analytics

## 🔒 Security

### Data Protection
- Row Level Security (RLS) on all user data
- Encrypted data transmission (HTTPS)
- Secure API key management
- Input validation and sanitization

### Privacy
- No real financial data collected
- User data anonymization options
- GDPR compliance ready
- Clear privacy policy

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful commit messages
- Add JSDoc comments for functions

## 📝 API Documentation

Comprehensive API documentation is available in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

### Key Endpoints
- Authentication: Sign up, sign in, session management
- Trading: Create trades, get history, close positions
- Scenarios: Start scenarios, track progress
- Analytics: Get performance metrics
- Subscriptions: Manage billing and plans

## 🐛 Troubleshooting

### Common Issues

**Q: The app shows "API key not configured" errors**
A: Add your API keys to the `.env` file. The app works in demo mode without keys.

**Q: Real-time updates aren't working**
A: Check your Supabase configuration and ensure real-time is enabled.

**Q: Subscription payments fail**
A: Verify your Stripe configuration and webhook endpoints.

**Q: AI feedback is generic**
A: Ensure your OpenAI API key is valid and has sufficient credits.

### Getting Help
- Check the [API Documentation](docs/API_DOCUMENTATION.md)
- Search existing [GitHub Issues](https://github.com/vistara-apps/this-is-a-2904/issues)
- Create a new issue with detailed information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing AI-powered feedback capabilities
- **Supabase** for the excellent backend-as-a-service platform
- **Stripe** for secure payment processing
- **Recharts** for beautiful data visualizations
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

- **Email**: support@simutrade.com
- **Documentation**: [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- **Issues**: [GitHub Issues](https://github.com/vistara-apps/this-is-a-2904/issues)

---

**Made with ❤️ for aspiring traders worldwide**

Start your trading journey today with SimuTrade - where learning meets practice in a risk-free environment!
