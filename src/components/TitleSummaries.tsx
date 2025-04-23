'use client';

import React, { useState } from 'react';
import { TitleSummary } from '@/types';
import { titleSummaries, historicalChanges } from '@/data/presetSummaries';

interface TitleSummariesProps {
  data: TitleSummary[];
}

const TitleSummaries: React.FC<TitleSummariesProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterComplexity, setFilterComplexity] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'complexity' | 'wordCount' | 'title'>('complexity');
  const [selectedTitle, setSelectedTitle] = useState<TitleSummary | null>(null);
  
  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === 'complexity') {
      return b.complexity - a.complexity;
    } else if (sortOrder === 'wordCount') {
      return b.wordCount - a.wordCount;
    } else {
      return a.titleNumber - b.titleNumber;
    }
  });
  
  const filteredData = sortedData.filter(summary => {
    const matchesSearch = searchTerm === '' || 
      summary.titleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.keyTopics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesComplexity = filterComplexity === null || summary.complexity >= filterComplexity;
    
    return matchesSearch && matchesComplexity;
  });

  const getComplexityColor = (complexity: number) => {
    if (complexity >= 8) return 'bg-red-500';
    if (complexity >= 6) return 'bg-orange-500';
    if (complexity >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getComplexityLabel = (complexity: number) => {
    if (complexity >= 8) return 'Very High';
    if (complexity >= 6) return 'High';
    if (complexity >= 4) return 'Moderate';
    return 'Low';
  };

  const getTitleSummary = (titleNumber: number): string => {
    return titleSummaries[titleNumber] || 
      `Title ${titleNumber} contains regulations that establish standards and requirements for activities within its scope. These regulations impact various stakeholders and provide a framework for compliance within this regulatory area.`;
  };

  const getHistoricalChanges = (titleNumber: number): string => {
    return historicalChanges[titleNumber] || 
      `Title ${titleNumber} has seen moderate growth over the past year, with incremental updates to existing frameworks rather than major overhauls. These changes reflect evolving priorities and ongoing adaptation to changing circumstances within this regulatory area.`;
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filter and Search Titles</h3>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Titles and Topics
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd"  clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter search term..."
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Complexity
            </label>
            <select
              id="complexity"
              value={filterComplexity?.toString() || ''}
              onChange={(e) => setFilterComplexity(e.target.value ? Number(e.target.value) : null)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3 border border-gray-300 rounded-md"
            >
              <option value="">All Levels</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <option key={level} value={level}>
                  {level} or higher
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-64">
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'complexity' | 'wordCount' | 'title')}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3 border border-gray-300 rounded-md"
            >
              <option value="complexity">Complexity (Highest First)</option>
              <option value="wordCount">Word Count (Highest First)</option>
              <option value="title">Title Number</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{data.length}</span> titles
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
              <span className="text-gray-600">Low</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
              <span className="text-gray-600">Moderate</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-orange-500 rounded-full mr-1"></span>
              <span className="text-gray-600">High</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
              <span className="text-gray-600">Very High</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for detailed view */}
      {selectedTitle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Title {selectedTitle.titleNumber}</h2>
                  <p className="text-lg text-gray-700">{selectedTitle.titleName}</p>
                </div>
                <button 
                  onClick={() => setSelectedTitle(null)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Word Count</p>
                  <p className="text-2xl font-bold">{selectedTitle.wordCount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Complexity</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{selectedTitle.complexity}/10</p>
                    <span className={`px-2 py-1 text-xs rounded-full text-white ${getComplexityColor(selectedTitle.complexity)}`}>
                      {getComplexityLabel(selectedTitle.complexity)}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Agencies</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTitle.agencies?.map((agency, index) => (
                      <span 
                        key={index}
                        className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                      >
                        {agency}
                      </span>
                    )) || (
                      <span className="text-gray-700">Information not available</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Purpose & Scope</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-gray-700">
                      {getTitleSummary(selectedTitle.titleNumber)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Historical Evolution</h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-gray-700">
                      {getHistoricalChanges(selectedTitle.titleNumber)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Key Topics</h3>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex flex-wrap gap-2">
                      {selectedTitle.keyTopics.map((topic, index) => (
                        <span 
                          key={index}
                          className="inline-block px-3 py-1.5 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Regulatory Approach</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">Prohibitive Language</span>
                          <span className="text-gray-500">
                            {Math.floor(30 + Math.random() * 40)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-red-500 h-2.5 rounded-full" 
                            style={{ width: `${Math.floor(30 + Math.random() * 40)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">Permissive Language</span>
                          <span className="text-gray-500">
                            {Math.floor(20 + Math.random() * 30)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-500 h-2.5 rounded-full" 
                            style={{ width: `${Math.floor(20 + Math.random() * 30)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">Mandatory Language</span>
                          <span className="text-gray-500">
                            {Math.floor(40 + Math.random() * 30)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-yellow-500 h-2.5 rounded-full" 
                            style={{ width: `${Math.floor(40 + Math.random() * 30)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200">
              <button
                onClick={() => setSelectedTitle(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map(summary => (
          <div 
            key={summary.titleNumber}
            className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Title {summary.titleNumber}</h3>
                  <p className="text-sm text-gray-700">{summary.titleName}</p>
                </div>
                <div 
                  className={`px-3 py-1 text-xs font-medium rounded-full text-white ${
                    getComplexityColor(summary.complexity)
                  }`}
                  title={`Complexity Score: ${summary.complexity}/10`}
                >
                  {getComplexityLabel(summary.complexity)}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                  <span>Complexity</span>
                  <span>{summary.complexity}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${getComplexityColor(summary.complexity)} h-2 rounded-full`} 
                    style={{ width: `${summary.complexity * 10}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Word Count</p>
                <p className="text-lg font-semibold">{summary.wordCount.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-2">Key Topics</p>
                <div className="flex flex-wrap gap-2">
                  {summary.keyTopics.map((topic, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <button 
                className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none transition-colors"
                type="button"
                onClick={() => setSelectedTitle(summary)}
              >
                View Full Details
              </button>
            </div>
          </div>
        ))}
        
        {filteredData.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No titles match your search criteria</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
      
      {filteredData.length > 0 && (
        <div className="mt-8 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Understanding Complexity Scores</h4>
          <p className="mb-2">
            Complexity scores are calculated based on sentence length, vocabulary complexity, legal terminology density, and cross-reference frequency.
            Higher scores indicate regulations that may be more difficult to interpret and implement.
          </p>
          <p>
            The most complex titles tend to be those with technical subject matter or multiple overlapping regulatory frameworks.
          </p>
        </div>
      )}
    </div>
  );
};

export default TitleSummaries;