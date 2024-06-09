'use client';

import { useState } from 'react';
import { useArticles } from 'hooks/useArticles';
import { ArticleList } from 'components/ArticleList';
import { ArticleFilter } from 'components/ArticleFilter';
import { ArticleNav } from 'components/ArticleNav';
import { getUtcNow, getStartOfUtcDay, getEndOfUtcDay } from 'lib/formatDate';

export default function Home() {
  const { articles, isLoading } = useArticles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!articles.length) {
    return <div>No articles found.</div>;
  }

  // 現在のUTC日時を取得
  const utcNow = getUtcNow();

  // UTCの0時から開始する日付を設定
  const startOfToday = getStartOfUtcDay(utcNow);
  const endOfToday = getEndOfUtcDay(utcNow);

  const todayArticles = articles.filter((article) => {
    const publishedAt = new Date(article.publishedAt);
    return publishedAt >= startOfToday && publishedAt <= endOfToday;
  });

  let filteredArticles = articles;
  if (selectedDate) {
    const startOfSelectedDate = getStartOfUtcDay(new Date(selectedDate));
    const endOfSelectedDate = getEndOfUtcDay(new Date(selectedDate));

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
