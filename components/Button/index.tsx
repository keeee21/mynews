import React from 'react';

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

export const Button: React.FC<Props> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300'
    >
      {children}
    </button>
  );
};
