'use client';

import { useState, useEffect } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { Section } from '@/components/Section';
import { ArticleNav } from '@/components/ArticleNav';
import { DateFilter } from '@/components/DateFilter';
import { ARTICLE_SOURCES } from '@/consts/articleSouece';
import type { Article } from '@prisma/client';

interface HomeProps {
  initialArticles: Article[];
}

const convertToLocalDate = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate;
};

const filterArticlesByDate = (
  articles: Article[],
  startDate: Date,
  endDate: Date
) => {
  return articles.filter((article) => {
    const publishedAtLocal = convertToLocalDate(new Date(article.publishedAt));
    return publishedAtLocal >= startDate && publishedAtLocal <= endDate;
  });
};

export default function Home({ initialArticles }: HomeProps) {
  const { articles: fetchedArticles, isLoading } = useArticles();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (fetchedArticles.length > 0) {
      setArticles(fetchedArticles);
    }
  }, [fetchedArticles]);

  if (isLoading && articles.length === 0) {
    return <div>Loading...</div>;
  }

  if (!articles.length) {
    return <div>No articles found.</div>;
  }

  // 現在のユーザーのローカル日時を取得
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  const todayArticles = filterArticlesByDate(
    articles,
    startOfToday,
    endOfToday
  );

  let filteredArticles = articles;
  if (selectedDate) {
    const startOfSelectedDate = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfSelectedDate = new Date(selectedDate.setHours(23, 59, 59, 999));
    filteredArticles = filterArticlesByDate(
      articles,
      startOfSelectedDate,
      endOfSelectedDate
    );
  }

  return (
    <main className='min-h-screen p-12'>
      <div className='z-10 max-w-5xl w-full font-mono text-sm'>
        <DateFilter
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <ArticleNav selectedDate={selectedDate} />
        {!selectedDate && (
          <Section id='today' title='今日のNews' articles={todayArticles} />
        )}
        <Section
          id='hatebu'
          title='はてぶ'
          articles={filteredArticles.filter(
            (article) => article.sourceId === ARTICLE_SOURCES.HATEBU.id
          )}
        />
        <Section
          id='rss'
          title='RSS'
          articles={filteredArticles.filter(
            (article) => article.sourceId === ARTICLE_SOURCES.RSS.id
          )}
        />
        <Section
          id='podcast'
          title='Podcast'
          articles={filteredArticles.filter(
            (article) => article.sourceId === ARTICLE_SOURCES.PODCAST.id
          )}
        />
      </div>
    </main>
  );
}
