'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AgencyWordCountChart from '@/components/AgencyWordCountChart';
import HistoricalChangesChart from '@/components/HistoricalChangesChart';
import TitleSummaries from '@/components/TitleSummaries';
import ActionMetrics from '@/components/ActionMetrics';
import { AnalysisResults, TabType } from '@/types';

export default function Home() {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('word-count');

  useEffect(() => {
    fetchLatestResults();
  }, []);

  const fetchLatestResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ecfr');
      
      if (!response.ok) {
        throw new Error(`Error fetching results: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAnalysisResults(data);
    } catch (err) {
      setError('Error loading data. Please try again later.');
      console.error('Error fetching latest results:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!analysisResults) return null;

    switch (activeTab) {
      case 'word-count':
        return <AgencyWordCountChart data={analysisResults.agencyWordCounts} />;
      case 'historical':
        return analysisResults.historicalChanges ? (
          <HistoricalChangesChart data={analysisResults.historicalChanges} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            Historical data not available.
          </div>
        );
      case 'summaries':
        return analysisResults.summaries ? (
          <TitleSummaries data={analysisResults.summaries} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            Title summaries not available.
          </div>
        );
      case 'actions':
        return analysisResults.actionMetrics ? (
          <ActionMetrics data={analysisResults.actionMetrics} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            Action metrics not available.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">eCFR Analyzer</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Analysis of the Electronic Code of Federal Regulations
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {analysisResults ? new Date(analysisResults.lastUpdated).toLocaleString() : 'Loading...'}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        ) : analysisResults ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="text-white/80 text-sm mb-1">Total Word Count</div>
                  <div className="text-3xl font-bold">{analysisResults.totalWordCount.toLocaleString()}</div>
                  <div className="mt-2 text-white/70 text-xs">Words across all titles</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="text-white/80 text-sm mb-1">Agencies</div>
                  <div className="text-3xl font-bold">{70}</div>
                  <div className="mt-2 text-white/70 text-xs">Federal agencies with regulations</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="text-white/80 text-sm mb-1">Actions</div>
                  <div className="text-3xl font-bold">
                    {analysisResults.actionMetrics ? 
                      (analysisResults.actionMetrics.prohibitedActions + 
                       analysisResults.actionMetrics.permittedActions + 
                       analysisResults.actionMetrics.mandatoryActions).toLocaleString() : 'N/A'}
                  </div>
                  <div className="mt-2 text-white/70 text-xs">Regulatory actions identified</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-md">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('word-count')}
                    className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                      activeTab === 'word-count' 
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    type="button"
                  >
                    Word Count
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('historical')}
                    className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                      activeTab === 'historical' 
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    type="button"
                  >
                    Historical Changes
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('summaries')}
                    className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                      activeTab === 'summaries' 
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    type="button"
                  >
                    Title Summaries
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('actions')}
                    className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors duration-200 ${
                      activeTab === 'actions' 
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    type="button"
                  >
                    Action Metrics
                  </button>
                </nav>
              </div>
            </div>
            
      
            <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-md p-6 mb-8">
              {renderTabContent()}
            </div>
            
       
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About eCFR Analyzer</h2>
              <p className="text-gray-700 dark:text-gray-300">
                This tool provides quantitative analysis of the Electronic Code of Federal Regulations (eCFR),
                tracking word counts, historical changes, and regulatory actions across all 50 titles.
              </p>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}

export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-600">
        Loading eCFR analysis...
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="min-h-screen p-8">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Error Loading Data</h2>
        <p>{error.message}</p>
      </div>
    </div>
  );
}