import { NextRequest, NextResponse } from 'next/server';
import { analyzeAllCFRTitles } from '@/lib/analyze-ecfr';

export async function POST(request: NextRequest) {
  try {
    const { date } = await request.json();
    
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
    }
    const results = await analyzeAllCFRTitles(date);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error analyzing eCFR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}