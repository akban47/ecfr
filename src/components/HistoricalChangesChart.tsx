'use client';

import React, { useState } from 'react';
import { HistoricalChange } from '@/types';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler,
  ChartOptions,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

interface HistoricalChangesChartProps {
  data: HistoricalChange[];
}

const HistoricalChangesChart: React.FC<HistoricalChangesChartProps> = ({ data }) => {
  const [selectedTitles, setSelectedTitles] = useState<number[]>([1, 5, 10, 40]);
    const allTitleNumbers = Array.from(new Set(data.map(item => item.titleNumber))).sort((a, b) => a - b);
    const dates = Array.from(new Set(data.map(item => item.date))).sort();
    const filteredData = data.filter(item => selectedTitles.includes(item.titleNumber));
    const dataByTitle = selectedTitles.map(titleNumber => {
    const titleData = filteredData.filter(item => item.titleNumber === titleNumber);
        titleData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return {
      titleNumber,
      data: titleData
    };
  });
  
  const colors = [
    'rgba(53, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(231, 233, 237, 0.8)',
    'rgba(156, 39, 176, 0.8)',
    'rgba(33, 150, 243, 0.8)',
  ];
  
  const chartData: ChartData<'line'> = {
    labels: dates.map(date => {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }),
    datasets: dataByTitle.map((titleData, index) => {
      const color = colors[index % colors.length];
      
      return {
        label: `Title ${titleData.titleNumber}`,
        data: dates.map(date => {
          const item = titleData.data.find(d => d.date === date);
          return item ? item.wordCount : 0;
        }),
        borderColor: color,
        backgroundColor: color.replace('0.8', '0.1'),
        fill: false,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      };
    }),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2, 
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Historical Word Count Changes by Title',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          footer: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const datasetIndex = tooltipItems[0].datasetIndex;
            const date = dates[index];
            const titleNumber = selectedTitles[datasetIndex];
            
            const item = data.find(d => d.date === date && d.titleNumber === titleNumber);
            
            if (item && item.changeFromPrevious !== 0) {
              const sign = item.changeFromPrevious > 0 ? '+' : '';
              return [
                `Change: ${sign}${item.changeFromPrevious.toLocaleString()} words`,
                `Percent Change: ${sign}${item.percentChange.toFixed(2)}%`
              ];
            }
            return '';
          },
        },
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        caretSize: 8,
        cornerRadius: 6,
        boxPadding: 4
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Word Count',
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: { bottom: 10, top: 10 }
        },
        ticks: {
          font: {
            size: 12
          },
          padding: 8,
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: { bottom: 10, top: 10 }
        },
        ticks: {
          font: {
            size: 12
          },
          padding: 8
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.03)'
        }
      },
    },
    animation: {
      duration: 1500,
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  const handleTitleToggle = (titleNumber: number) => {
    if (selectedTitles.includes(titleNumber)) {
      setSelectedTitles(selectedTitles.filter(t => t !== titleNumber));
    } else {
      setSelectedTitles([...selectedTitles, titleNumber]);
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Select Titles to Compare:</h3>
        <div className="flex flex-wrap gap-2">
          {allTitleNumbers.slice(0, 20).map(titleNumber => (
            <button
              key={titleNumber}
              onClick={() => handleTitleToggle(titleNumber)}
              className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                selectedTitles.includes(titleNumber)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              type="button"
            >
              Title {titleNumber}
            </button>
          ))}
          {allTitleNumbers.length > 20 && (
            <span className="text-sm text-gray-500 self-center px-2">
              + {allTitleNumbers.length - 20} more
            </span>
          )}
        </div>
      </div>
      
      <div style={{ height: '600px' }} className="w-full">
        <Line data={chartData} options={options} />
      </div>
      
      <div className="mt-8 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Trend Analysis</h4>
        <p className="mb-2">
          This chart tracks the changing volume of regulations over time. Upward trends indicate 
          expanding regulatory frameworks, while downward trends may suggest regulatory streamlining.
        </p>
        <p>
          Select different titles using the buttons above to compare regulatory growth patterns
          across different subject areas.
        </p>
      </div>
    </div>
  );
};

export default HistoricalChangesChart;