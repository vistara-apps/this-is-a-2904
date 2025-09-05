// Enhanced AI service with OpenAI integration
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getAIFeedback = async (trade, marketData) => {
  // If no API key is provided, fall back to mock service
  if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'your_openai_api_key_here') {
    return getMockFeedback(trade, marketData);
  }

  try {
    const { type, symbol, quantity, entryPrice, exitPrice, profitLoss } = trade;
    const { price: currentPrice, changePercent, volume } = marketData;
    
    const positionValue = quantity * entryPrice;
    const isClosedTrade = exitPrice !== null;
    
    const prompt = `Analyze this ${isClosedTrade ? 'completed' : 'open'} trade and provide constructive feedback:

Trade Details:
- Action: ${type.toUpperCase()} ${quantity} shares of ${symbol}
- Entry Price: $${entryPrice}
${isClosedTrade ? `- Exit Price: $${exitPrice}` : ''}
${isClosedTrade ? `- Profit/Loss: $${profitLoss.toFixed(2)}` : ''}
- Position Value: $${positionValue.toFixed(2)}

Market Context:
- Current Price: $${currentPrice}
- Price Change: ${changePercent.toFixed(2)}%
- Volume: ${volume?.toLocaleString() || 'N/A'}

Please provide feedback in JSON format with these fields:
- type: "positive", "neutral", or "negative"
- analysis: A detailed analysis of the trade timing and decision (2-3 sentences)
- suggestions: Array of 2-4 actionable suggestions for improvement
- riskLevel: "low", "medium", or "high"
- marketCondition: Brief description of market conditions
- confidence: Number between 70-100 representing confidence in the analysis

Focus on educational value and constructive guidance for a learning trader.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert trading coach providing educational feedback to help traders improve their skills. Always be constructive and focus on learning opportunities."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fall back to mock service if API fails
    return getMockFeedback(trade, marketData);
  }
};

// Mock feedback service as fallback
const getMockFeedback = async (trade, marketData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { type, symbol, quantity, entryPrice } = trade;
  const { price: currentPrice, changePercent } = marketData;

  // Analyze trade based on market conditions and trade details
  const isGoodTiming = Math.abs(changePercent) < 2; // Low volatility is generally better for entries
  const isLargePosition = (quantity * entryPrice) > 5000; // $5000+ is considered large
  const priceDirection = changePercent > 0 ? 'rising' : 'falling';

  let analysis = '';
  let suggestions = [];
  let riskLevel = 'medium';
  let feedbackType = 'neutral';

  // Generate contextual feedback based on trade characteristics
  if (type === 'buy') {
    if (changePercent > 0 && changePercent < 3) {
      analysis = `Good timing on this buy order for ${symbol}. You entered during a moderate uptrend (${changePercent.toFixed(2)}%), which suggests positive momentum without excessive FOMO buying.`;
      suggestions = [
        'Consider setting a stop loss at 5-8% below your entry price',
        'Monitor volume to confirm the upward momentum',
        'Take partial profits if the stock rises 15-20%'
      ];
      riskLevel = 'low';
      feedbackType = 'positive';
    } else if (changePercent < -2) {
      analysis = `You bought ${symbol} during a declining period (${changePercent.toFixed(2)}%). This could be value buying, but be aware of potential further decline.`;
      suggestions = [
        'Watch for signs of trend reversal before adding more',
        'Consider your risk tolerance - falling knives can keep falling',
        'Set a tight stop loss to limit potential losses'
      ];
      riskLevel = 'high';
      feedbackType = 'negative';
    } else {
      analysis = `You purchased ${symbol} in a relatively stable market condition. This neutral entry reduces timing risk.`;
      suggestions = [
        'Monitor key support and resistance levels',
        'Consider the overall market trend in your holding period',
        'Plan your exit strategy before emotions take over'
      ];
    }
  } else { // sell order
    if (changePercent < 0 && changePercent > -3) {
      analysis = `Smart sell timing on ${symbol}. You sold during a moderate decline (${changePercent.toFixed(2)}%), potentially avoiding larger losses.`;
      suggestions = [
        'Good risk management - preserving capital is key',
        'Consider if this was a planned exit or emotional decision',
        'Look for re-entry opportunities if fundamentals remain strong'
      ];
      riskLevel = 'low';
      feedbackType = 'positive';
    } else if (changePercent > 2) {
      analysis = `You sold ${symbol} during an uptrend (${changePercent.toFixed(2)}%). This might be profit-taking, but consider if you're exiting too early.`;
      suggestions = [
        'Evaluate if this aligns with your original profit target',
        'Consider partial position sizing for trending stocks',
        'Don\'t let FOMO drive you back in at higher prices'
      ];
      riskLevel = 'medium';
    } else {
      analysis = `You sold ${symbol} in stable market conditions. Neutral timing reduces the risk of poor exit decisions.`;
      suggestions = [
        'Review your reasons for exiting',
        'Consider if this frees up capital for better opportunities',
        'Maintain discipline in your trading strategy'
      ];
    }
  }

  // Add position size considerations
  if (isLargePosition) {
    suggestions.push('Large position size detected - ensure this aligns with your risk management rules');
    if (riskLevel === 'low') riskLevel = 'medium';
    if (riskLevel === 'medium') riskLevel = 'high';
  }

  return {
    type: feedbackType,
    analysis,
    suggestions,
    riskLevel,
    marketCondition: priceDirection,
    confidence: Math.floor(Math.random() * 30) + 70 // 70-100%
  };
};

// Real OpenAI integration would look like this:
/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const getAIFeedback = async (trade, marketData) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are an expert trading coach. Analyze trades and provide constructive feedback in JSON format with fields: analysis (string), suggestions (array), riskLevel (low/medium/high), type (positive/neutral/negative)."
        },
        {
          role: "user",
          content: `Analyze this trade: ${trade.type} ${trade.quantity} shares of ${trade.symbol} at $${trade.entryPrice}. Current market data: price $${marketData.price}, change ${marketData.changePercent.toFixed(2)}%.`
        }
      ],
      temperature: 0.7,
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('AI feedback error:', error);
    return {
      type: 'neutral',
      analysis: 'Unable to generate AI feedback at this time.',
      suggestions: ['Continue practicing your trading strategy'],
      riskLevel: 'medium'
    };
  }
};
*/
