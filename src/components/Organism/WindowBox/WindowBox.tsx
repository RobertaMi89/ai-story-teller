import styles from "@/components/Organism/WindowBox.module.scss";

interface WindowBoxProps {
  title?: string;
}

function WindowBox(props: WindowBoxProps) {
  const { title } = props;
  return <div className={styles.main}>{title && <h2>{title}</h2>}</div>;
}

export default WindowBox;
