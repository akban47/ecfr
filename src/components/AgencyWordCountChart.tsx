'use client';

import React from 'react';
import { AgencyWordCount } from '@/types';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

interface AgencyWordCountChartProps {
  data: AgencyWordCount[];
}

const AgencyWordCountChart: React.FC<AgencyWordCountChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.wordCount - a.wordCount).slice(0, 10);
  
  const chartData = {
    labels: sortedData.map(item => item.agency),
    datasets: [
      {
        label: 'Word Count',
        data: sortedData.map(item => item.wordCount),
        backgroundColor: [
          'rgba(53, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(231, 233, 237, 0.8)',
          'rgba(156, 39, 176, 0.8)',
          'rgba(33, 150, 243, 0.8)'
        ],
        borderColor: [
          'rgba(53, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(231, 233, 237, 1)',
          'rgba(156, 39, 176, 1)',
          'rgba(33, 150, 243, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold' as const
          },
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Word Count by Agency (Top 10)',
        font: {
          size: 18,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          footer: (tooltipItems: any[]) => {
            const index = tooltipItems[0].dataIndex;
            const titles = sortedData[index].titleNumbers.join(', ');
            return `Titles: ${titles}`;
          },
        },
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        caretSize: 8,
        cornerRadius: 6
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Word Count',
          font: {
            size: 14,
            weight: 'bold' as const
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
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Agency',
          font: {
            size: 14,
            weight: 'bold' as const
          },
          padding: { bottom: 10, top: 10 }
        },
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 45,
          minRotation: 45,
          padding: 8
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const
    },
  };

  return (
    <div className="w-full px-4 py-6">
      <div style={{ height: '600px' }} className="w-full">
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="mt-8 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Analysis Insights</h4>
        <p>
          This chart shows the total word count in the Code of Federal Regulations for each federal agency. 
          The agencies with larger word counts typically have more complex and extensive regulatory frameworks.
        </p>
      </div>
    </div>
  );
};

export default AgencyWordCountChart;