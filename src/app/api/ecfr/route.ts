import { NextResponse } from 'next/server';
import { getLatestAnalysisResults } from '@/lib/analyze-ecfr';

export async function GET() {
  try {
    const latestResults = await getLatestAnalysisResults();
    if (!latestResults) {
      return NextResponse.json({ error: 'No analysis results found' }, { status: 404 });
    }
    
    return NextResponse.json(latestResults);
  } catch (error) {
    console.error('Error retrieving eCFR analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}