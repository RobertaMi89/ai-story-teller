import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  label: string;
  onClick?: () => any;
}

function Button(props: ButtonProps) {
  const { label, onClick } = props;
  return (
    <button className={styles.main} onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;
