import { PrismaClient } from '@prisma/client';
import Home from '@/components/Home';
import type { Article } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Page() {
  const articles: Article[] = await prisma.article.findMany({
    orderBy: {
      publishedAt: 'desc',
    },
  });

  return <Home initialArticles={articles} />;
}
