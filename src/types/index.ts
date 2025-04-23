export interface CFRTitle {
  number: number;
  name: string;
  agencies: string[];
}

export interface AgencyWordCount {
  agency: string;
  wordCount: number;
  titleNumbers: number[];
}

export interface HistoricalVersion {
  date: string;
  version: string;
  changes: string[];
}

export interface Version {
  date: string;
  effectiveDate?: string;
  title: string;
  type: string;
}

export interface HistoricalChange {
  date: string;
  titleNumber: number;
  wordCount: number;
  changeFromPrevious: number;
  percentChange: number;
  version: Version;
}

export interface TitleAnalysis {
  titleNumber: number;
  titleName: string;
  wordCount: number;
  agencies: string[];
  date: string;
}

export interface AnalysisResults {
  agencyWordCounts: AgencyWordCount[];
  totalWordCount: number;
  lastUpdated: string;
  historicalChanges?: HistoricalChange[];
  summaries?: TitleSummary[];
  actionMetrics?: ActionMetrics;
}

export interface TitleSummary {
  titleNumber: number;
  titleName: string;
  wordCount: number;
  keyTopics: string[];
  complexity: number;
  agencies?: string[];
}

export interface ActionMetrics {
  prohibitedActions: number;
  permittedActions: number;
  mandatoryActions: number;
  top10Keywords: Array<{keyword: string, count: number}>;
}

export type TabType = 'word-count' | 'historical' | 'summaries' | 'actions';