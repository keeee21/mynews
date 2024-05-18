'use client';

import { useState, useEffect } from 'react';
import type { Article } from '@prisma/client';
import { formatDate } from 'lib/formatDate';
import axios from 'axios';

async function getArticles(): Promise<Article[]> {
  const res = await axios.get('./article/api/');
  return res.data.articles;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('getArticles');
        const fetchedArticles = await getArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!articles.length) {
    return <div>No articles found.</div>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayArticles = articles.filter((article) => {
    const publishedAt = new Date(article.publishedAt);
    return publishedAt >= today;
  });

  const podcastArticles = articles.filter((article) => article.sourceId === 1);
  const hatebuArticles = articles.filter((article) => article.sourceId === 2);
  const rssArticles = articles.filter((article) => article.sourceId === 3);

  return (
    <main className='min-h-screen p-12'>
      <div className='z-10 max-w-5xl w-full font-mono text-sm'>
        <h1 className='text-xl font-bold bg-gray-600 text-white p-2'>
          今日のNews
        </h1>
        <ul className='bg-white p-2'>
          {todayArticles.map((article) => (
            <li
              key={article.id}
              className='my-2 underline underline-offset-2 decoration-gray-300 decoration-2'
            >
              <span className='font-bold'>
                {formatDate(new Date(article.publishedAt))}
              </span>
              <a href={article.url} target='_blank' rel='noopener noreferrer'>
                {article.title}
              </a>
            </li>
          ))}
        </ul>

        <h1 className='text-xl font-bold bg-gray-600 text-white p-2 mt-8'>
          Podcast
        </h1>
        <ul className='bg-white p-2'>
          {podcastArticles.map((article) => (
            <li
              key={article.id}
              className='my-2 underline underline-offset-2 decoration-gray-300 decoration-2'
            >
              <span className='font-bold'>
                {formatDate(new Date(article.publishedAt))}
              </span>
              <a href={article.url} target='_blank' rel='noopener noreferrer'>
                {article.title}
              </a>
            </li>
          ))}
        </ul>

        <h1 className='text-xl font-bold bg-gray-600 text-white p-2 mt-8'>
          はてぶ
        </h1>
        <ul className='bg-white p-2'>
          {hatebuArticles.map((article) => (
            <li
              key={article.id}
              className='my-2 underline underline-offset-2 decoration-gray-300 decoration-2'
            >
              <span className='font-bold'>
                {formatDate(new Date(article.publishedAt))}
              </span>
              <a href={article.url} target='_blank' rel='noopener noreferrer'>
                {article.title}
              </a>
            </li>
          ))}
        </ul>

        <h1 className='text-xl font-bold bg-gray-600 text-white p-2 mt-8'>
          RSS
        </h1>
        <ul className='bg-white p-2'>
          {rssArticles.map((article) => (
            <li
              key={article.id}
              className='my-2 underline underline-offset-2 decoration-gray-300 decoration-2'
            >
              <span className='font-bold'>
                {formatDate(new Date(article.publishedAt))}
              </span>
              <a href={article.url} target='_blank' rel='noopener noreferrer'>
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
