import { DOMParser } from 'xmldom';
import axios from 'axios';
import { CFRTitle } from '../types';

const BASE_URL = 'https://www.ecfr.gov/api';

interface Version {
  date: string;
  effectiveDate?: string;
  title: string;
  type: string;
}

/**
 * Fetches the full text XML content for a specific CFR title
 * @param date The date to get the CFR title for, in YYYY-MM-DD format
 * @param title The title number (1-50)
 * @returns The XML content as a string
 */
export async function fetchFullTitleXml(date: string, title: number): Promise<string> {
  try {
    const url = `${BASE_URL}/versioner/v1/full/2025-04-17/title-${title}.xml`;
    console.log(`Fetching from URL: ${url}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching title ${title} for date ${date}:`, error);
    throw error;
  }
}

/**
 * 
 * @returns
 */
export async function fetchAllTitles(): Promise<CFRTitle[]> {
  const titles: CFRTitle[] = [];
  
  for (let i = 1; i <= 50; i++) {
    titles.push({
      number: i,
      name: getTitleName(i),
      agencies: getTitleAgencies(i)
    });
  }
  
  return titles;
}

/**
 * 
 * @param xmlContent
 * @returns
 */
export function parseXmlToText(xmlContent: string): string {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  
  return xmlDoc.getElementsByTagName('*')[0].textContent || '';
}

/**
 * 
 * @param titleNumber
 * @returns
 */
function getTitleName(titleNumber: number): string {
  const titleNames: Record<number, string> = {
    1: 'General Provisions',
    2: 'Grants and Agreements',
    3: 'The President',
    4: 'Accounts',
    5: 'Administrative Personnel',
    6: 'Domestic Security',
    7: 'Agriculture',
    8: 'Aliens and Nationality',
    9: 'Animals and Animal Products',
    10: 'Energy',
    11: 'Federal Elections',
    12: 'Banks and Banking',
    13: 'Business Credit and Assistance',
    14: 'Aeronautics and Space',
    15: 'Commerce and Foreign Trade',
    16: 'Commercial Practices',
    17: 'Commodity and Securities Exchanges',
    18: 'Conservation of Power and Water Resources',
    19: 'Customs Duties',
    20: 'Employees\' Benefits',
    21: 'Food and Drugs',
    22: 'Foreign Relations',
    23: 'Highways',
    24: 'Housing and Urban Development',
    25: 'Indians',
    26: 'Internal Revenue',
    27: 'Alcohol, Tobacco Products and Firearms',
    28: 'Judicial Administration',
    29: 'Labor',
    30: 'Mineral Resources',
    31: 'Money and Finance: Treasury',
    32: 'National Defense',
    33: 'Navigation and Navigable Waters',
    34: 'Education',
    35: 'Reserved',
    36: 'Parks, Forests, and Public Property',
    37: 'Patents, Trademarks, and Copyrights',
    38: 'Pensions, Bonuses, and Veterans\' Relief',
    39: 'Postal Service',
    40: 'Protection of Environment',
    41: 'Public Contracts and Property Management',
    42: 'Public Health',
    43: 'Public Lands: Interior',
    44: 'Emergency Management and Assistance',
    45: 'Public Welfare',
    46: 'Shipping',
    47: 'Telecommunication',
    48: 'Federal Acquisition Regulations System',
    49: 'Transportation',
    50: 'Wildlife and Fisheries'
  };
  
  return titleNames[titleNumber] || `Title ${titleNumber}`;
}

/**
 * 
 * @param titleNumber 
 * @returns
 */
function getTitleAgencies(titleNumber: number): string[] {
  const titleAgencies: Record<number, string[]> = {
    1: ['Administrative Committee of the Federal Register', 'Office of the Federal Register'],
    2: ['Office of Management and Budget'],
    3: ['The White House', 'Executive Office of the President'],
    4: ['Government Accountability Office', 'Department of the Treasury'],
    5: ['Office of Personnel Management', 'Merit Systems Protection Board'],
    6: ['Department of Homeland Security'],
    7: ['Department of Agriculture'],
    8: ['Department of Homeland Security', 'Department of Justice'],
    9: ['Animal and Plant Health Inspection Service', 'Department of Agriculture'],
    10: ['Department of Energy', 'Nuclear Regulatory Commission'],
    11: ['Federal Election Commission'],
    12: ['Department of the Treasury', 'Federal Reserve System'],
    13: ['Small Business Administration'],
    14: ['Federal Aviation Administration', 'National Aeronautics and Space Administration'],
    15: ['Department of Commerce', 'Bureau of Industry and Security'],
    16: ['Federal Trade Commission', 'Consumer Product Safety Commission'],
    17: ['Commodity Futures Trading Commission', 'Securities and Exchange Commission'],
    18: ['Federal Energy Regulatory Commission'],
    19: ['U.S. Customs and Border Protection', 'International Trade Commission'],
    20: ['Office of Workers\' Compensation Programs', 'Department of Labor'],
    21: ['Food and Drug Administration', 'Drug Enforcement Administration'],
    22: ['Department of State', 'Agency for International Development'],
    23: ['Federal Highway Administration'],
    24: ['Department of Housing and Urban Development'],
    25: ['Bureau of Indian Affairs', 'Department of the Interior'],
    26: ['Internal Revenue Service'],
    27: ['Alcohol and Tobacco Tax and Trade Bureau', 'Bureau of Alcohol, Tobacco, Firearms, and Explosives'],
    28: ['Department of Justice', 'Federal Bureau of Prisons'],
    29: ['Department of Labor', 'National Labor Relations Board'],
    30: ['Mine Safety and Health Administration', 'Department of the Interior'],
    31: ['Department of the Treasury', 'Office of Management and Budget'],
    32: ['Department of Defense'],
    33: ['U.S. Army Corps of Engineers', 'Coast Guard'],
    34: ['Department of Education'],
    35: ['Reserved'],
    36: ['National Park Service', 'Forest Service'],
    37: ['U.S. Patent and Trademark Office', 'Copyright Office'],
    38: ['Department of Veterans Affairs'],
    39: ['United States Postal Service'],
    40: ['Environmental Protection Agency'],
    41: ['General Services Administration', 'Department of Defense'],
    42: ['Centers for Medicare & Medicaid Services', 'Public Health Service'],
    43: ['Bureau of Land Management', 'Department of the Interior'],
    44: ['Federal Emergency Management Agency'],
    45: ['Department of Health and Human Services', 'Administration for Children and Families'],
    46: ['Maritime Administration', 'Coast Guard'],
    47: ['Federal Communications Commission'],
    48: ['Department of Defense', 'General Services Administration', 'National Aeronautics and Space Administration'],
    49: ['Department of Transportation'],
    50: ['U.S. Fish and Wildlife Service', 'National Marine Fisheries Service']
  };
  
  return titleAgencies[titleNumber] || [];
}

interface DateRange {
  startDate: string;
  endDate: string;
}

export async function fetchTitleVersions(
  titleNumber: number,
  dateRange: DateRange
): Promise<Version[]> {
  const url = `${BASE_URL}/api/versioner/v1/history/${titleNumber}?dateFrom=${dateRange.startDate}&dateTo=${dateRange.endDate}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch versions: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
export async function fetchTitleAtDate(
  titleNumber: number,
  date: string
): Promise<string> {
  const url = `${BASE_URL}/api/versioner/v1/full/${date}/title-${titleNumber}.xml`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch title at date: ${response.statusText}`);
  }

  return response.text();
}

export async function fetchMultipleTitleVersions(
  titleNumbers: number[], 
  dateRange: DateRange
): Promise<Record<number, Version[]>> {
  try {
    const results = await Promise.all(
      titleNumbers.map(title => 
        fetchTitleVersions(title, dateRange)
          .then(versions => ({ title, versions }))
          .catch(error => {
            console.error(`Error fetching versions for title ${title}:`, error);
            return { title, versions: [] };
          })
      )
    );

    return results.reduce((acc, { title, versions }) => {
      acc[title] = versions;
      return acc;
    }, {} as Record<number, Version[]>);
  } catch (error) {
    console.error('Error fetching multiple title versions:', error);
    throw error;
  }
}