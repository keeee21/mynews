import { NextResponse } from 'next/server';
import { getTodayArticles } from './service';

export async function GET() {
  const news = await getTodayArticles();
  return NextResponse.json({ articles: news });
}
