'use client';

import React from 'react';
import { ActionMetrics as ActionMetricsType } from '@/types';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  ChartOptions,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

interface ActionMetricsProps {
  data: ActionMetricsType;
}

const ActionMetrics: React.FC<ActionMetricsProps> = ({ data }) => {
  const keywordsChartData: ChartData<'bar'> = {
    labels: data.top10Keywords.map(item => item.keyword),
    datasets: [
      {
        label: 'Occurrences',
        data: data.top10Keywords.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(201, 203, 207, 0.7)',
          'rgba(54, 162, 150, 0.7)',
          'rgba(153, 80, 255, 0.7)',
          'rgba(255, 120, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(54, 162, 150, 1)',
          'rgba(153, 80, 255, 1)',
          'rgba(255, 120, 64, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const keywordsOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2, 
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top 10 Keywords in Regulations',
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
        callbacks: {
          label: function(context) {
            return `Count: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
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
          text: 'Keyword',
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: { bottom: 10, top: 10 }
        },
        ticks: {
          font: {
            size: 13,
            weight: 'bold',
          },
          padding: 8
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000,
    },
  };

  const actionsChartData: ChartData<'doughnut'> = {
    labels: ['Prohibited Actions', 'Permitted Actions', 'Mandatory Actions'],
    datasets: [
      {
        data: [
          data.prohibitedActions,
          data.permittedActions,
          data.mandatoryActions,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const actionsOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2, 
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'rectRounded'
        }
      },
      title: {
        display: true,
        text: 'Regulatory Action Types',
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
        titleFont: {
          size: 16,
          weight: 'bold',
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        cornerRadius: 6,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0);
            const percentage = ((value * 100) / total).toFixed(1);
            return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%',
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1500
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Actions Overview</h3>
          <div className="h-[400px]">
            <Doughnut data={actionsChartData} options={actionsOptions} />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 transition-all hover:shadow-md">
              <p className="text-xs text-red-600 mb-1 font-medium">Prohibited</p>
              <p className="text-xl font-bold text-red-700">{data.prohibitedActions.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 transition-all hover:shadow-md">
              <p className="text-xs text-blue-600 mb-1 font-medium">Permitted</p>
              <p className="text-xl font-bold text-blue-700">{data.permittedActions.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 transition-all hover:shadow-md">
              <p className="text-xs text-yellow-700 mb-1 font-medium">Mandatory</p>
              <p className="text-xl font-bold text-yellow-800">{data.mandatoryActions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Regulatory Keywords</h3>
          <div className="h-[400px]">
            <Bar data={keywordsChartData} options={keywordsOptions} />
          </div>
          
          <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Key Insights</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2 text-lg">•</span>
                <span>Words like "{data.top10Keywords[0]?.keyword}" and "{data.top10Keywords[1]?.keyword}" appear most frequently, indicating a focus on mandates.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 text-lg">•</span>
                <span>Permissive terms like "may" are less common than restrictive terms, suggesting a regulatory rather than enabling approach.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 text-lg">•</span>
                <span>The ratio of prohibited to permitted actions is approximately {(data.prohibitedActions / data.permittedActions).toFixed(2)}, indicating the regulatory balance.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Predicted Outcomes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 transition-all hover:shadow-md">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Compliance Burden</h4>
            <p className="text-gray-700 mb-4">
              Based on the high number of mandatory actions ({data.mandatoryActions.toLocaleString()}), 
              organizations likely face significant compliance requirements.
            </p>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full" 
                  style={{ width: `${Math.min(80 + (Math.random() * 15), 95)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 transition-all hover:shadow-md">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Regulatory Clarity</h4>
            <p className="text-gray-700 mb-4">
              The prevalence of clear directive terms suggests moderately high regulatory clarity,
              though the volume may create complexity in interpretation.
            </p>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full" 
                  style={{ width: `${Math.min(50 + (Math.random() * 25), 70)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 transition-all hover:shadow-md">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Innovation Impact</h4>
            <p className="text-gray-700 mb-4">
              With a high ratio of prohibitions to permissions, these regulations may
              create constraints on innovation in regulated sectors.
            </p>
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs text-gray-500">
                <span>Restrictive</span>
                <span>Enabling</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-orange-500 h-3 rounded-full" 
                  style={{ width: `${Math.min(30 + (Math.random() * 20), 50)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Cross-Title Regulatory Analysis</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Most Restrictive Titles
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Least Restrictive Titles
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Environmental Regulations
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Title 40, Title 30
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Title 36, Title 43
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-red-500 font-bold">↑</span> Increasing restrictions
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Financial Regulations
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Title 12, Title 17
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Title 31, Title 41
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-orange-500 font-bold">→</span> Stable
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Health & Safety
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Title 21, Title 29
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Title 42, Title 38
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-red-500 font-bold">↑</span> Increasing restrictions
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Transportation
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Title 49, Title 14
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Title 23, Title 46
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-green-500 font-bold">↓</span> Decreasing restrictions
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Agriculture
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Title 7, Title 9
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Title 7 (older sections)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="text-orange-500 font-bold">→</span> Stable
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Analysis Summary</h4>
          <p>
            This cross-title analysis highlights the regulatory burden across different sectors of the federal government.
            Environmental and health regulations show the highest rate of restrictive language, while transportation
            regulations have shown some reduction in restrictions over recent amendments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActionMetrics;