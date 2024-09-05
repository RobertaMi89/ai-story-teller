import { ReactNode } from "react";
import style from "./RightSidebar.module.scss";

interface RightSidebarProps {
  title?: string;
  children: ReactNode;
}

const RightSidebar = (props: RightSidebarProps) => {
  const { title, children } = props;
  return (
    <div className={style.rightSidebar}>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};

export default RightSidebar;
