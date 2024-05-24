import axios from 'axios';
import type { Article } from '@prisma/client';

export async function getArticles(date?: string): Promise<Article[]> {
  const res = await axios.get('./article/api/', { params: { date } });
  return res.data.articles;
}
