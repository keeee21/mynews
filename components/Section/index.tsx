import React from 'react';
import type { Article } from '@prisma/client';
import { List } from '../List';

type SectionProps = {
  id: string;
  title: string;
  articles: Article[];
};

export const Section: React.FC<SectionProps> = ({ id, title, articles }) => {
  return (
    <>
      <h1 id={id} className='text-xl font-bold bg-gray-600 text-white p-2 mt-8'>
        {title}
      </h1>
      <ul className='bg-white p-2'>
        <List articles={articles} />
      </ul>
    </>
  );
};
