import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Award, AlertCircle, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrading } from '../context/TradingContext';

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const { trades } = useTrading();
  const [timeframe, setTimeframe] = useState('30d');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateAnalytics();
  }, [trades, timeframe]);

  const calculateAnalytics = () => {
    setLoading(true);
    
    // Filter trades based on timeframe
    const now = new Date();
    const timeframeMs = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000
    };
    
    const cutoffDate = new Date(now.getTime() - timeframeMs[timeframe]);
    const filteredTrades = trades.filter(trade => 
      new Date(trade.timestamp) >= cutoffDate
    );

    const closedTrades = filteredTrades.filter(trade => trade.status === 'closed');
    const openTrades = filteredTrades.filter(trade => trade.status === 'open');

    // Calculate key metrics
    const totalTrades = filteredTrades.length;
    const winningTrades = closedTrades.filter(trade => trade.profitLoss > 0);
    const losingTrades = closedTrades.filter(trade => trade.profitLoss < 0);
    
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    const totalPnL = closedTrades.reduce((sum, trade) => sum + trade.profitLoss, 0);
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((sum, trade) => sum + trade.profitLoss, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, trade) => sum + trade.profitLoss, 0) / losingTrades.length) : 0;
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

    // Calculate daily P&L for chart
    const dailyPnL = {};
    closedTrades.forEach(trade => {
      const date = new Date(trade.timestamp).toISOString().split('T')[0];
      if (!dailyPnL[date]) {
        dailyPnL[date] = 0;
      }
      dailyPnL[date] += trade.profitLoss;
    });

    const chartData = Object.entries(dailyPnL)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, pnl]) => ({
        date: new Date(date).toLocaleDateString(),
        pnl: pnl,
        cumulativePnL: 0 // Will be calculated below
      }));

    // Calculate cumulative P&L
    let cumulative = 0;
    chartData.forEach(item => {
      cumulative += item.pnl;
      item.cumulativePnL = cumulative;
    });

    // Symbol performance
    const symbolStats = {};
    closedTrades.forEach(trade => {
      if (!symbolStats[trade.symbol]) {
        symbolStats[trade.symbol] = {
          symbol: trade.symbol,
          trades: 0,
          wins: 0,
          totalPnL: 0
        };
      }
      symbolStats[trade.symbol].trades++;
      if (trade.profitLoss > 0) symbolStats[trade.symbol].wins++;
      symbolStats[trade.symbol].totalPnL += trade.profitLoss;
    });

    const symbolPerformance = Object.values(symbolStats)
      .map(stat => ({
        ...stat,
        winRate: (stat.wins / stat.trades) * 100,
        avgPnL: stat.totalPnL / stat.trades
      }))
      .sort((a, b) => b.totalPnL - a.totalPnL);

    // Trade distribution by hour
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      trades: 0
    }));

    filteredTrades.forEach(trade => {
      const hour = new Date(trade.timestamp).getHours();
      hourlyDistribution[hour].trades++;
    });

    // Risk metrics
    const positionSizes = closedTrades.map(trade => trade.quantity * trade.entryPrice);
    const avgPositionSize = positionSizes.length > 0 ? positionSizes.reduce((a, b) => a + b, 0) / positionSizes.length : 0;
    const maxPositionSize = Math.max(...positionSizes, 0);
    const riskPerTrade = avgPositionSize / user.virtualBalance * 100;

    setAnalytics({
      overview: {
        totalTrades,
        winRate,
        totalPnL,
        profitFactor,
        avgWin,
        avgLoss,
        openPositions: openTrades.length,
        avgPositionSize,
        maxPositionSize,
        riskPerTrade
      },
      chartData,
      symbolPerformance,
      hourlyDistribution,
      recentTrades: filteredTrades.slice(0, 10)
    });

    setLoading(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { overview, chartData, symbolPerformance, hourlyDistribution } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text">Trading Analytics</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">Total P&L</p>
              <p className={`text-2xl font-bold ${overview.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(overview.totalPnL)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${overview.totalPnL >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {overview.totalPnL >= 0 ? 
                <TrendingUp className="h-6 w-6 text-green-600" /> : 
                <TrendingDown className="h-6 w-6 text-red-600" />
              }
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-text">{formatPercentage(overview.winRate)}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">Total Trades</p>
              <p className="text-2xl font-bold text-text">{overview.totalTrades}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted text-sm">Profit Factor</p>
              <p className="text-2xl font-bold text-text">{overview.profitFactor.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cumulative P&L Chart */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-text mb-4">Cumulative P&L</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'P&L']} />
              <Area 
                type="monotone" 
                dataKey="cumulativePnL" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trading Activity by Hour */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <h3 className="text-lg font-semibold text-text mb-4">Trading Activity by Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="trades" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Symbol Performance Table */}
      <div className="bg-surface rounded-lg p-6 shadow-card">
        <h3 className="text-lg font-semibold text-text mb-4">Symbol Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-text">Symbol</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Trades</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Win Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Total P&L</th>
                <th className="text-left py-3 px-4 font-semibold text-text">Avg P&L</th>
              </tr>
            </thead>
            <tbody>
              {symbolPerformance.map((symbol, index) => (
                <tr key={symbol.symbol} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-text">{symbol.symbol}</td>
                  <td className="py-3 px-4 text-muted">{symbol.trades}</td>
                  <td className="py-3 px-4 text-muted">{formatPercentage(symbol.winRate)}</td>
                  <td className={`py-3 px-4 font-medium ${symbol.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(symbol.totalPnL)}
                  </td>
                  <td className={`py-3 px-4 ${symbol.avgPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(symbol.avgPnL)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-muted text-sm">Avg Position Size</p>
              <p className="text-xl font-bold text-text">{formatCurrency(overview.avgPositionSize)}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-muted text-sm">Max Position Size</p>
              <p className="text-xl font-bold text-text">{formatCurrency(overview.maxPositionSize)}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-muted text-sm">Risk per Trade</p>
              <p className="text-xl font-bold text-text">{formatPercentage(overview.riskPerTrade)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
