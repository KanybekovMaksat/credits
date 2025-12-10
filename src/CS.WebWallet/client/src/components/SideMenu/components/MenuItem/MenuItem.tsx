import React, { ReactElement, useState } from "react";
import { NavLink } from "react-router-dom";
import Dropdown from "@components/Icons/ArrowIcon/ArrowIcon";
import { $sideMenu, menuChanged } from "@components/SideMenu/sideMenu.store";
import { useStore } from "effector-react";

export interface MenuItemProps {
  title: string;
  icon?: React.ReactNode;
  link: string;
  sub?: boolean;
  children?: ReactElement | ReactElement[];
}

const MenuItem: React.FC<MenuItemProps> = ({
  sub,
  title,
  icon,
  children,
  link,
}) => {
  const { open } = useStore($sideMenu);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [closing, setClosing] = useState<boolean>(false);

  function handleClose() {
    setClosing(true);

    setTimeout(() => {
      setClosing(false);
      setExpanded(false);
    }, 200);
  }

  function onClick() {
    if (expanded) {
      handleClose();
      return;
    }
    setExpanded(true);
    if (open) {
      menuChanged();
    }

    return;
  }

  return (
    <li className="menu_item">
      <NavLink
        onClick={() => onClick()}
        className={`container ${sub && "sub"}`}
        to={link}
      >
        <div className="menu_item_title">
          {icon}
          <span>{title}</span>
        </div>
        {children && <Dropdown isOpened={expanded} />}
      </NavLink>
      {children && expanded && (
        <div className={`sub_menu ${closing && "closing"}`}>
          <ul>{children}</ul>
        </div>
      )}
    </li>
  );
};

export default MenuItem;
