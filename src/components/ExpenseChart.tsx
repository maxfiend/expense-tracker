import React from 'react';
import { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Expense } from '../types/expense';
import { getCategoryTotals, formatCurrency } from '../utils/expenseUtils';
import { ToggleBurgerButton } from './ToggleBurgerButton';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface ExpenseChartProps {
  expenses: Expense[];
  chartType: 'pie' | 'bar';
  onChartTypeChange: (type: 'pie' | 'bar') => void;
  getUkrainianPlural: (count: number) => string;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({
  expenses,
  chartType,
  onChartTypeChange,
  getUkrainianPlural,
}) => {

  const [showList, setShowList] = useState(true);
  const categoryTotals = getCategoryTotals(expenses);

  if (categoryTotals.length === 0) {
    return (
      <div className="cyber-card rounded-lg p-8 text-center">
        <p className="text-purple-300 font-mono">// Дані для візуалізації відсутні</p>
      </div>
    );
  }

  const colors = [
    '#00d4ff',
    '#b347d9',
    '#ff0080',
    '#39ff14',
    '#ffff00',
    '#ff073a',
    '#ff00ff',
    '#00ffff',
    '#ff6600',
    '#9d00ff',
  ];

  const data = {
    labels: categoryTotals.map((item) => item.category),
    datasets: [
      {
        label: 'Сума витрат',
        data: categoryTotals.map((item) => item.total),
        backgroundColor: colors.slice(0, categoryTotals.length),
        borderColor: colors.slice(0, categoryTotals.length),
        borderWidth: chartType === 'pie' ? 3 : 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#e0e0e0',
          font: {
            family: 'Rajdhani',
            size: 14,
            weight: 600,
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        titleColor: '#00d4ff',
        bodyColor: '#e0e0e0',
        borderColor: '#00d4ff',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = formatCurrency(context.parsed);
            const total = categoryTotals.reduce((sum, item) => sum + item.total, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        titleColor: '#00d4ff',
        bodyColor: '#e0e0e0',
        borderColor: '#00d4ff',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            return `Сума: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 212, 255, 0.1)',
        },
        ticks: {
          color: '#e0e0e0',
          font: {
            family: 'Rajdhani',
            size: 12,
          },
          callback: (value: any) => formatCurrency(value),
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 212, 255, 0.1)',
        },
        ticks: {
          color: '#e0e0e0',
          font: {
            family: 'Rajdhani',
            size: 12,
          },
          maxRotation: 45,
        },
      },
    },
  };

  return (
    <div className="chart-container rounded-lg p-6 shadow-2xl neon-scan">

      {/* Кнопки переключения графика с отступом снизу */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => onChartTypeChange('pie')}
          className={`w-full px-4 py-2 text-sm text-center font-bold uppercase tracking-wide whitespace-nowrap leading-tight transition-all duration-300 ${chartType === 'pie'
            ? 'bg-cyan-500/30 text-cyan-400 border-cyan-400'
            : 'bg-transparent text-purple-400 hover:bg-cyan-500/10'
            }`}
        >
          Кругова
        </button>

        <button
          onClick={() => onChartTypeChange('bar')}
          className={`w-full px-4 py-2 text-sm text-center font-bold uppercase tracking-wide whitespace-nowrap leading-tight transition-all duration-300 ${chartType === 'bar'
            ? 'bg-cyan-500/30 text-cyan-400 border-cyan-400'
            : 'bg-transparent text-purple-400 hover:bg-cyan-500/10'
            }`}
        >
          Стовпчикова
        </button>
      </div>

      {/* График */}
      <div className="h-80">
        {chartType === 'pie' ? <Pie data={data} options={pieOptions} /> : <Bar data={data} options={barOptions} />}
      </div>

      {/* Список категорий */}

      <div className="mt-6 pt-4 border-t border-cyan-500/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wide font-mono">
            Розподіл за категоріями
          </h4>
          <div className="arrow text-green-400 neon-text">➡</div>
          <ToggleBurgerButton
            isOpen={showList}
            onClick={() => setShowList(!showList)}
            ariaLabel={showList ? 'Приховати список' : 'Показати список'}
          />
        </div>

        <div
          className={`transition-[max-height,opacity] ease-in-out overflow-hidden duration-1000 ${showList ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="space-y-2">
            {categoryTotals.map((item, index) => (
              <div
                key={item.category}
                className="flex items-center justify-between p-3 rounded-md bg-black/30 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: colors[index] }} />
                  <span className="text-sm text-cyan-300 font-mono font-medium">{item.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-400 neon-text font-mono">{formatCurrency(item.total)}</div>
                  <div className="text-xs text-purple-300 font-mono">
                    {item.count} {getUkrainianPlural(item.count)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
