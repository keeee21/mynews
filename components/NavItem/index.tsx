import { NavLink } from '../NavLink';

type NavItemProps = {
  id: string;
  label: string;
  onClick: (id: string) => void;
  isFirst?: boolean;
};

export const NavItem: React.FC<NavItemProps> = ({
  id,
  label,
  onClick,
  isFirst = false,
}) => {
  return (
    <li className={isFirst ? '' : 'ml-2'}>
      <NavLink id={id} label={label} onClick={onClick}></NavLink>
    </li>
  );
};
