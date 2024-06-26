import { PrismaClient } from '@prisma/client';
import { Article } from '@/app/common/types';
import { ARTICLE_SOURCES } from '@/consts/articleSouece';
const prisma = new PrismaClient();

// 全ての記事を取得する
export async function getAllArticles() {
  // publishedAtでソートして記事を取得
  const articles = await prisma.article.findMany({
    orderBy: {
      publishedAt: 'desc',
    },
  });
  return articles;
}

// 今日の記事を取得する
export async function getTodayArticles() {
  const today = new Date();

  const articles = await prisma.article.findMany({
    where: {
      createdAt: {
        gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        lt: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1
        ),
      },
    },
  });

  return articles;
}

// ソースごとの記事を取得する
export async function getArticlesBySourceId(sourceId: number) {
  const articles = await prisma.article.findMany({
    where: {
      sourceId: sourceId,
    },
  });
  return articles;
}

export async function saveArticles(articles: Article[]) {
  try {
    for (const article of articles) {
      await prisma.article.upsert({
        where: { url: article.url },
        update: {},
        create: {
          title: article.title,
          url: article.url,
          publishedAt: article.publishedAt,
          sourceId: article.sourceId,
        },
      });
    }
  } catch (error) {
    console.error('Error saving articles:', error);
  }
}

export async function getExistingEpisodeUrls(): Promise<string[]> {
  const result = await prisma.article.findMany({
    where: {
      sourceId: ARTICLE_SOURCES.PODCAST.id,
    },
    select: {
      url: true,
    },
  });

  return result.map((article) => article.url);
}
