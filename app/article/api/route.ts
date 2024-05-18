import { NextResponse } from 'next/server';
import { getAllArticles } from './service';

export async function GET() {
  const news = await getAllArticles();
  return NextResponse.json({ articles: news });
}
