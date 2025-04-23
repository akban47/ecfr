import { DOMParser } from 'xmldom';
import { HistoricalChange } from '@/types';

function extractElement(xmlDoc: Document, tagName: string): string | null {
  const elements = xmlDoc.getElementsByTagName(tagName);
  if (elements.length > 0) {
    return elements[0].textContent;
  }
  return null;
}

export function extractKeyTerms(xmlContent: string): Map<string, number> {
  const termFrequency = new Map<string, number>();
  const keyTerms = [
    'shall', 'must', 'required', 'prohibited', 'may', 'should', 
    'authorized', 'permitted', 'not', 'except', 'unless', 'violation',
    'compliance', 'penalty', 'requirement', 'obligation', 'restriction'
  ];
  
  const plainText = xmlContent.replace(/<[^>]*>/g, ' ').toLowerCase();
  
  keyTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'g');
    const matches = plainText.match(regex);
    termFrequency.set(term, matches ? matches.length : 0);
  });
  
  return termFrequency;
}

export function categorizeActions(termFrequency: Map<string, number>): {
  prohibitedActions: number;
  permittedActions: number;
  mandatoryActions: number;
} {
  let prohibitedActions = 0;
  let permittedActions = 0;
  let mandatoryActions = 0;
  
  prohibitedActions += termFrequency.get('prohibited') || 0;
  prohibitedActions += termFrequency.get('not') || 0;
  prohibitedActions += termFrequency.get('violation') || 0;
  prohibitedActions += termFrequency.get('restriction') || 0;
  
  permittedActions += termFrequency.get('may') || 0;
  permittedActions += termFrequency.get('authorized') || 0;
  permittedActions += termFrequency.get('permitted') || 0;
  
  mandatoryActions += termFrequency.get('shall') || 0;
  mandatoryActions += termFrequency.get('must') || 0;
  mandatoryActions += termFrequency.get('required') || 0;
  mandatoryActions += termFrequency.get('requirement') || 0;
  mandatoryActions += termFrequency.get('obligation') || 0;
  
  return { prohibitedActions, permittedActions, mandatoryActions };
}

export function calculateComplexity(xmlContent: string): number {
  const plainText = xmlContent.replace(/<[^>]*>/g, ' ');
  const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length === 0) return 1;
  
  const totalWords = sentences.reduce((sum, sentence) => {
    return sum + sentence.split(/\s+/).filter(w => w.length > 0).length;
  }, 0);
  const avgSentenceLength = totalWords / sentences.length;
  
  let complexWords = 0;
  const words = plainText.split(/\s+/).filter(w => w.length > 0);
  words.forEach(word => {
    if (word.length > 8) complexWords++;
  });
  const complexWordRatio = complexWords / words.length;
  
  const legalTerms = [
    'pursuant', 'thereof', 'whereof', 'herein', 'aforementioned',
    'notwithstanding', 'hereunder', 'whereby', 'thereto', 'thereafter'
  ];
  let legalTermCount = 0;
  legalTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = plainText.match(regex);
    legalTermCount += matches ? matches.length : 0;
  });
  const legalTermRatio = legalTermCount / words.length;
  
  const sentenceLengthFactor = Math.min(avgSentenceLength / 25, 1) * 4;
  const complexWordFactor = Math.min(complexWordRatio * 20, 1) * 4;
  const legalTermFactor = Math.min(legalTermRatio * 100, 1) * 2;
  
  return Math.max(1, Math.min(10, sentenceLengthFactor + complexWordFactor + legalTermFactor));
}

export function extractKeyTopics(xmlContent: string, titleName: string): string[] {
  const plainText = xmlContent.replace(/<[^>]*>/g, ' ').toLowerCase();
  const potentialTopics = {
    'general provisions': ['federal register', 'administrative procedure', 'regulatory policy'],
    'grants': ['grants management', 'federal assistance', 'funding requirements'],
    'president': ['executive orders', 'presidential proclamations', 'white house directives'],
    'personnel': ['federal employment', 'civil service', 'government ethics'],
    'agriculture': ['food safety', 'agricultural standards', 'rural development'],
    'energy': ['nuclear safety', 'renewable energy', 'fossil fuels'],
    'banking': ['financial institutions', 'consumer banking', 'monetary policy'],
    'aeronautics': ['air safety', 'space exploration', 'flight standards'],
    'commerce': ['trade regulation', 'business standards', 'consumer protection'],
    'securities': ['securities trading', 'commodity futures', 'investor protection'],
    'food': ['pharmaceutical approval', 'food standards', 'medical devices'],
    'internal revenue': ['tax compliance', 'deductions', 'corporate taxation'],
    'labor': ['workplace safety', 'employment standards', 'labor rights'],
    'environment': ['air quality', 'clean water', 'hazardous waste'],
    'health': ['healthcare', 'public health', 'medical research'],
    'telecommunication': ['broadcast standards', 'spectrum management', 'internet regulation'],
    'transportation': ['highway safety', 'aviation', 'railroad operations']
  };

  let matchedTopics: string[] = [];
  Object.entries(potentialTopics).forEach(([key, topics]) => {
    if (titleName.toLowerCase().includes(key)) {
      matchedTopics = [...matchedTopics, ...topics];
    }
  });
  
  if (matchedTopics.length === 0) {
    matchedTopics = ['regulatory compliance', 'federal standards'];
    const titleWords = titleName.split(' ');
    if (titleWords.length > 1) {
      const significantWord = titleWords.find(word => word.length > 4) || titleWords[0];
      matchedTopics.push(`${significantWord.toLowerCase()} regulations`);
    }
  }
  
  while (matchedTopics.length < 3) {
    matchedTopics.push('federal oversight');
  }
  
  return matchedTopics;
}

export function parseXmlToText(xmlContent: string): string {
  return xmlContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}