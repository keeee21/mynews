'use client';

import { useState } from 'react';
import { useArticles } from 'hooks/useArticles';
import { ArticleList } from 'components/ArticleList';
import { ArticleFilter } from 'components/ArticleFilter';
import { ArticleNav } from 'components/ArticleNav';

export default function Home() {
  const { articles, isLoading } = useArticles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!articles.length) {
    return <div>No articles found.</div>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  const todayArticles = articles.filter((article) => {
    const publishedAt = new Date(article.publishedAt);
    return publishedAt >= today && publishedAt <= endOfToday;
  });

  let filteredArticles = articles;
  if (selectedDate) {
    const startOfSelectedDate = new Date(selectedDate);
    startOfSelectedDate.setHours(0, 0, 0, 0);

    const endOfSelectedDate = new Date(selectedDate);
    endOfSelectedDate.setHours(23, 59, 59, 999);

    filteredArticles = articles.filter((article) => {
      const publishedAt = new Date(article.publishedAt);
      return (
        publishedAt >= startOfSelectedDate && publishedAt <= endOfSelectedDate
      );
    });
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
