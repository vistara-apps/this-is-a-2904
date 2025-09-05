import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTradingStore } from '../stores/tradingStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Chart({ symbol, scenario }) {
  const { marketData, lastPrices } = useTradingStore();
  const [chartData, setChartData] = useState(null);
  const [livePrice, setLivePrice] = useState(null);

  useEffect(() => {
    if (!marketData[symbol]) return;

    const data = marketData[symbol];
    const currentPrice = lastPrices[symbol];
    
    // Add current live price to chart data
    const today = new Date().toISOString().split('T')[0];
    const extendedData = [...data];
    
    // Update or add today's price
    const todayIndex = extendedData.findIndex(d => d.x === today);
    if (todayIndex >= 0) {
      extendedData[todayIndex].y = currentPrice;
    } else {
      extendedData.push({ x: today, y: currentPrice });
    }

    setChartData({
      labels: extendedData.map(d => d.x),
      datasets: [
        {
          label: symbol,
          data: extendedData.map(d => d.y),
          borderColor: scenario ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)',
          backgroundColor: scenario ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
        },
      ],
    });

    setLivePrice(currentPrice);
  }, [symbol, marketData, lastPrices, scenario]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          },
        },
      },
    },
  };

  if (!chartData) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-md">
      {/* Price Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-md">
          <span className="text-2xl font-bold">
            ${livePrice?.toFixed(2) || '0.00'}
          </span>
          {scenario && (
            <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded">
              Scenario Active
            </span>
          )}
        </div>
        <div className="text-sm text-muted">
          Live Price
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>

      {scenario && (
        <div className="bg-warning/10 border border-warning/20 rounded-md p-md">
          <h4 className="font-semibold text-sm mb-1">{scenario.title}</h4>
          <p className="text-xs text-muted">{scenario.description}</p>
        </div>
      )}
    </div>
  );
}