import { ReactNode } from "react";
import style from "./WindowBox.module.scss";

interface WindowBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const WindowBox = (props: WindowBoxProps) => {
  const { title, children, className } = props;
  return (
    <div className={`${style.main} ${className ? className : ""}`}>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};

export default WindowBox;
