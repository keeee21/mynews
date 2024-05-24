import React from 'react';
import type { Article } from '@prisma/client';
import { formatDate } from 'lib/formatDate';

type ArticleListProps = {
  id: string;
  title: string;
  articles: Article[];
};

export const ArticleList: React.FC<ArticleListProps> = ({
  id,
  title,
  articles,
}) => {
  return (
    <>
      <h1 id={id} className='text-xl font-bold bg-gray-600 text-white p-2 mt-8'>
        {title}
      </h1>
      <ul className='bg-white p-2'>
        {articles.map((article) => (
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
    </>
  );
};
