import React from 'react';

type NavLinkProps = {
  id: string;
  label: string;
  onClick: (id: string) => void;
  additionalClasses?: string;
};

export const NavLink: React.FC<NavLinkProps> = ({
  id,
  label,
  onClick,
  additionalClasses,
}) => {
  return (
    <a
      href={`#${id}`}
      onClick={() => onClick(id)}
      className={`bg-white px-3 py-1 rounded-md hover:bg-gray-200 ${additionalClasses}`}
    >
      {label}
    </a>
  );
};
