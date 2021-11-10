import styles from './footer.module.scss';

export default function Footer(): JSX.Element {
  return (
    <footer className={styles.container}>
      <div className={styles.content}>Desenvolvido com Next.JS</div>
    </footer>
  );
}
