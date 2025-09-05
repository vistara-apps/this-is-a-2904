import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateTradeFeedback(trade, userContext = {}) {
  try {
    const prompt = `
    Analyze this trading decision and provide constructive feedback:
    
    Trade Details:
    - Symbol: ${trade.symbol}
    - Type: ${trade.type}
    - Quantity: ${trade.quantity}
    - Entry Price: $${trade.entryPrice}
    - Exit Price: $${trade.exitPrice || 'Still Open'}
    - Profit/Loss: $${trade.profitLoss || 'N/A'}
    - Duration: ${trade.duration || 'Ongoing'}
    
    User Context:
    - Experience Level: ${userContext.level || 'Beginner'}
    - Previous Trades: ${userContext.tradeCount || 0}
    - Overall P/L: $${userContext.totalPL || 0}
    
    Provide:
    1. Quick assessment (Good/Needs Improvement/Poor)
    2. 2-3 key insights about the decision
    3. 1 specific actionable tip for improvement
    4. Risk management assessment
    
    Keep it concise and educational, suitable for a learning trader.
    `;

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are an expert trading mentor providing constructive feedback to help users improve their trading skills. Be encouraging but honest about areas for improvement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'Unable to generate feedback at this time.';
  } catch (error) {
    console.error('AI Feedback Error:', error);
    return 'Feedback temporarily unavailable. Your trade has been recorded for later analysis.';
  }
}

export async function generateScenarioGuidance(scenario, userAction) {
  try {
    const prompt = `
    Market Scenario: ${scenario.title}
    Description: ${scenario.description}
    User Action: ${userAction}
    
    Provide brief guidance:
    1. Was this action appropriate for the scenario?
    2. What should the user consider next?
    3. Key learning point from this scenario
    
    Keep response under 150 words.
    `;

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a trading education assistant helping users learn from market scenarios.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.6,
    });

    return response.choices[0]?.message?.content || 'Guidance temporarily unavailable.';
  } catch (error) {
    console.error('AI Guidance Error:', error);
    return 'Guidance temporarily unavailable. Continue practicing and learning.';
  }
}