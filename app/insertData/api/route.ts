import { NextResponse } from 'next/server';
import { insertHatebu, insertPodcast, insertRss } from './service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== process.env.PASSWORD) {
    return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const articleCount = await prisma.article.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    if (articleCount === 0) {
      await insertRss();
      await insertPodcast();
      await insertHatebu();
    } else {
      console.log('今日の記事が既に存在するため、APIの実行をスキップします。');
    }
  } catch (e) {
    console.log(e);
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json({ status: 'ok' });
}
