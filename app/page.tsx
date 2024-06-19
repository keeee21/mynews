'use client';

import { useState } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { Section } from '@/components/Section';
import { ArticleFilter } from '@/components/ArticleFilter';
import { ArticleNav } from '@/components/ArticleNav';

interface Article {
  id: number;
  title: string;
  url: string;
  sourceId: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
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

export default function Home() {
  const { articles, isLoading } = useArticles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!articles.length) {
    return <div>No articles found.</div>;
  }

  // 現在のユーザーのローカル日時を取得
  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const endOfToday = new Date(now.setHours(23, 59, 59, 999));

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
        <ArticleFilter
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
            (article) => article.sourceId === 2
          )}
        />
        <Section
          id='rss'
          title='RSS'
          articles={filteredArticles.filter(
            (article) => article.sourceId === 3
          )}
        />
        <Section
          id='podcast'
          title='Podcast'
          articles={filteredArticles.filter(
            (article) => article.sourceId === 1
          )}
        />
      </div>
    </main>
  );
}
