import type { Article } from '@prisma/client';
import { formatDate } from 'lib/formatDate';
import ErrorMessage from './ErrorMessage';

async function getArticles(): Promise<Article[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}`);
  const data = await res.json();
  return data.articles;
}

export default async function Home() {
  let articles: Article[] = [];
  let error: Error | null = null;

  try {
    articles = await getArticles();
  } catch (e) {
    error = e as Error;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!articles.length) {
    return <div>Loading...</div>;
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
                {formatDate(new Date(article.publishedAt))}{' '}
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
                {formatDate(new Date(article.publishedAt))}{' '}
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
                {formatDate(new Date(article.publishedAt))}{' '}
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
                {formatDate(new Date(article.publishedAt))}{' '}
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
