import React from 'react';

type ArticleFilterProps = {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
};

export const ArticleFilter: React.FC<ArticleFilterProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const handleClearClick = () => {
    onDateChange(null);
  };

  return (
    <div className='flex items-center space-x-2'>
      <div>
        <label htmlFor='date-input' className='mr-1'>
          Select date:
        </label>
        <input
          id='date-input'
          type='date'
          value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
          onChange={(e) =>
            onDateChange(e.target.value ? new Date(e.target.value) : null)
          }
          className='border border-gray-300 rounded-md px-2 py-1'
        />
      </div>
      {selectedDate && (
        <button
          onClick={handleClearClick}
          className='bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300'
        >
          Clear
        </button>
      )}
    </div>
  );
};
