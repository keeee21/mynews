import { Article } from '@prisma/client';
import { formatDate } from '@/lib/formatDate';

type ListProps = {
  articles: Article[];
};

export const List: React.FC<ListProps> = ({ articles }) => {
  return (
    <>
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
    </>
  );
};
