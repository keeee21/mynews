'use client';

import { useState } from 'react';
import { useArticles } from 'hooks/useArticles';
import { ArticleList } from 'components/ArticleList';
import { ArticleFilter } from 'components/ArticleFilter';
import { ArticleNav } from 'components/ArticleNav';

interface Article {
  id: number;
  title: string;
  url: string;
  sourceId: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const filterArticlesByDate = (
  articles: Article[],
  startDate: Date,
  endDate: Date
) => {
  return articles.filter((article) => {
    const publishedAt = new Date(article.publishedAt);
    return publishedAt >= startDate && publishedAt <= endDate;
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
          <ArticleList id='today' title='今日のNews' articles={todayArticles} />
        )}
        <ArticleList
          id='podcast'
          title='Podcast'
          articles={filteredArticles.filter(
            (article) => article.sourceId === 1
          )}
        />
        <ArticleList
          id='hatebu'
          title='はてぶ'
          articles={filteredArticles.filter(
            (article) => article.sourceId === 2
          )}
        />
        <ArticleList
          id='rss'
          title='RSS'
          articles={filteredArticles.filter(
            (article) => article.sourceId === 3
          )}
        />
      </div>
    </main>
  );
}
