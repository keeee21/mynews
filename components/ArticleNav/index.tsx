import { NavItem } from '../NavItem';

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
          <NavItem
            id='today'
            label='今日のNews'
            onClick={handleTitleClick}
            isFirst
          />
        )}
        <NavItem id='podcast' label='Podcast' onClick={handleTitleClick} />
        <NavItem id='hatebu' label='はてぶ' onClick={handleTitleClick} />
        <NavItem id='rss' label='RSS' onClick={handleTitleClick} />
      </ul>
    </div>
  );
};
