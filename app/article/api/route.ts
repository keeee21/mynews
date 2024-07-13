import { getAllArticles } from '../service';
import { NextResponse } from 'next/server';

export async function GET() {
  const news = await getAllArticles();

  const response = NextResponse.json({ news });
  response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate');
  return response;
}
