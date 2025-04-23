import { fetchFullTitleXml, parseXmlToText, fetchAllTitles, fetchTitleVersions, fetchTitleAtDate } from './ecfr-api';
import { AgencyWordCount, TitleAnalysis, AnalysisResults, HistoricalChange } from '../types';
import clientPromise from './mongodb';

export async function analyzeCFRTitle(date: string, titleNumber: number): Promise<TitleAnalysis> {
  try {
        const xmlContent = await fetchFullTitleXml(date, titleNumber);
    const textContent = parseXmlToText(xmlContent);
    const wordCount = countWords(textContent);
    
    const titles = await fetchAllTitles();
    const title = titles.find(t => t.number === titleNumber);
    
    if (!title) {
      throw new Error(`Title ${titleNumber} not found`);
    }
    
    return {
      titleNumber,
      titleName: title.name,
      wordCount,
      agencies: title.agencies,
      date,
    };
  } catch (error) {
    console.error(`Error analyzing title ${titleNumber}:`, error);
    throw error;
  }
}

export async function analyzeAllCFRTitles(date: string): Promise<AnalysisResults> {
  try {
    const titleAnalyses: TitleAnalysis[] = [];
    const titlesToAnalyze = Array.from({ length: 50 }, (_, i) => i + 1);
    
    for (const titleNumber of titlesToAnalyze) {
      try {
        const analysis = await analyzeCFRTitle(date, titleNumber);
        titleAnalyses.push(analysis);
      } catch (error) {
        console.error(`Skipping title ${titleNumber} due to error:`, error);
      }
    }
    
    const agencyWordCounts = aggregateByAgency(titleAnalyses);
    const totalWordCount = titleAnalyses.reduce((sum, analysis) => sum + analysis.wordCount, 0);
    
    const result: AnalysisResults = {
      agencyWordCounts,
      totalWordCount,
      lastUpdated: new Date().toISOString()
    };
    
    await saveAnalysisResults(result, date);
    return result;
  } catch (error) {
    console.error('Error analyzing all CFR titles:', error);
    throw error;
  }
}

export async function getLatestAnalysisResults(): Promise<AnalysisResults | null> {
  try {
    const client = await clientPromise;
    const db = client.db('ecfr_analyzer');
    
    const latestAnalysis = await db.collection('analysis_results')
      .find()
      .sort({ date: -1 })
      .limit(1)
      .toArray();
    
    return latestAnalysis.length ? latestAnalysis[0] as unknown as AnalysisResults : null;
  } catch (error) {
    console.error('Error retrieving latest analysis results:', error);
    throw error;
  }
}
async function saveAnalysisResults(results: AnalysisResults, date: string): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db('ecfr_analyzer');
    await db.collection('analysis_results').insertOne({ ...results, date });
  } catch (error) {
    console.error('Error saving analysis results to MongoDB:', error);
    throw error;
  }
}

function aggregateByAgency(titleAnalyses: TitleAnalysis[]): AgencyWordCount[] {
  const agencyMap = new Map<string, AgencyWordCount>();
  
  for (const analysis of titleAnalyses) {
    for (const agency of analysis.agencies) {
      if (agencyMap.has(agency)) {
        const existing = agencyMap.get(agency)!;
        existing.wordCount += analysis.wordCount;
        existing.titleNumbers.push(analysis.titleNumber);
      } else {
        agencyMap.set(agency, {
          agency,
          wordCount: analysis.wordCount,
          titleNumbers: [analysis.titleNumber]
        });
      }
    }
  }
  
  return Array.from(agencyMap.values())
    .sort((a, b) => b.wordCount - a.wordCount);
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

