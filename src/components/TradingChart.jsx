import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMarket } from '../context/MarketContext';

const TradingChart = () => {
  const { chartData, selectedSymbol, marketData } = useMarket();
  const currentPrice = marketData[selectedSymbol]?.price || 0;
  const change = marketData[selectedSymbol]?.changePercent || 0;

  return (
    <div className="glass-effect rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">{selectedSymbol}</h2>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-2xl font-bold text-white">
              ${currentPrice.toFixed(2)}
            </span>
            <span className={`text-sm px-2 py-1 rounded ${
              change > 0 ? 'bg-accent/20 text-accent' : 'bg-red-500/20 text-red-400'
            }`}>
              {change > 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-white/10 text-white rounded hover:bg-white/20 transition-colors">
            1D
          </button>
          <button className="px-3 py-1 text-sm bg-primary text-white rounded">
            1M
          </button>
          <button className="px-3 py-1 text-sm bg-white/10 text-white rounded hover:bg-white/20 transition-colors">
            1Y
          </button>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradingChart;