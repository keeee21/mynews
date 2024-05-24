import React from 'react';

type ArticleNavProps = {
  selectedDate: Date | null;
};

export const ArticleNav: React.FC<ArticleNavProps> = ({ selectedDate }) => {
  const handleTitleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='mt-4 inline-block'>
      <ul className='flex bg-gray-100 p-2 rounded-md'>
        {!selectedDate && (
          <li>
            <a
              href='#today'
              onClick={() => handleTitleClick('today')}
              className='bg-white px-3 py-1 rounded-md hover:bg-gray-200'
            >
              今日のNews
            </a>
          </li>
        )}
        <li>
          <a
            href='#podcast'
            onClick={() => handleTitleClick('podcast')}
            className='bg-white px-3 py-1 rounded-md hover:bg-gray-200 ml-2'
          >
            Podcast
          </a>
        </li>
        <li>
          <a
            href='#hatebu'
            onClick={() => handleTitleClick('hatebu')}
            className='bg-white px-3 py-1 rounded-md hover:bg-gray-200 ml-2'
          >
            はてぶ
          </a>
        </li>
        <li>
          <a
            href='#rss'
            onClick={() => handleTitleClick('rss')}
            className='bg-white px-3 py-1 rounded-md hover:bg-gray-200 ml-2'
          >
            RSS
          </a>
        </li>
      </ul>
    </div>
  );
};
