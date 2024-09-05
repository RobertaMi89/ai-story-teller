import { Dispatch, SetStateAction, useEffect } from "react";
import style from "./Toast.module.scss";

interface ToastProps {
  title: string;
  message: string;
  setAction: Dispatch<SetStateAction<boolean>>;
}

const Toast = (props: ToastProps) => {
  const { title, message, setAction } = props;

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setAction(false);
    }, 3000);
    return () => clearTimeout(timeoutID);
  }, [setAction]);

  return (
    <div>
      <div className={style.danger}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
