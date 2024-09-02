import Button from "@/components/Atoms/Button/Button";
import styles from "@/components/Molecules/Header/Header.module.scss";

interface HeaderProps {
  title: string;
}

function Header(props: HeaderProps) {
  const { title } = props;
  return (
    <div className={styles.main}>
      <h1>{title}</h1>
      <Button label="Login"></Button>
    </div>
  );
}

export default Header;
