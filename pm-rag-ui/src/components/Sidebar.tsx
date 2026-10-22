import React from 'react';
import styles from './Sidebar.module.css';

interface SidebarItem {
  label: string;
  onClick: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.sidebarList}>
        {items.map((item, index) => (
          <li key={index} className={styles.sidebarItem} onClick={item.onClick}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;