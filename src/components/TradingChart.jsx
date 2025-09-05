import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTrading } from '../context/TradingContext';

const TradingChart = () => {
  const { selectedSymbol, setSelectedSymbol, marketData, symbols } = useTrading();
  const currentData = marketData[selectedSymbol];

  // Generate chart data
  const chartData = React.useMemo(() => {
    if (!currentData) return [];
    
    const data = [];
    const basePrice = currentData.price - 10;
    
    for (let i = 0; i < 30; i++) {
      data.push({
        time: new Date(Date.now() - (29 - i) * 1000 * 60).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        price: basePrice + Math.random() * 20,
      });
    }
    
    // Add current price as last point
    data.push({
      time: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      price: currentData.price,
    });
    
    return data;
  }, [currentData]);

  if (!currentData) {
    return (
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const isPositive = currentData.change >= 0;

  return (
    <div className="bg-surface rounded-lg p-6 shadow-card">
      {/* Symbol Selector */}
      <div className="flex items-center justify-between mb-4">
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="text-lg font-semibold bg-transparent border-none outline-none cursor-pointer"
        >
          {symbols.map(symbol => (
            <option key={symbol} value={symbol}>{symbol}</option>
          ))}
        </select>
        
        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="text-accent" size={20} />
          ) : (
            <TrendingDown className="text-red-500" size={20} />
          )}
        </div>
      </div>

      {/* Price Information */}
      <div className="flex items-end gap-4 mb-6">
        <div className="text-3xl font-bold text-text">
          ${currentData.price.toFixed(2)}
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-accent' : 'text-red-500'}`}>
          <span className="font-medium">
            {isPositive ? '+' : ''}${currentData.change.toFixed(2)}
          </span>
          <span className="text-sm">
            ({isPositive ? '+' : ''}{currentData.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <Tooltip 
              contentStyle={{
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? '#22c55e' : '#ef4444'} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: isPositive ? '#22c55e' : '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TradingChart;