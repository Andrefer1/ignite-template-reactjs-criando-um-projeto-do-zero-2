import Link from 'next/link';

import styles from './OthersPosts.module.scss';

interface Post {
  uid: string;
  data: {
    title: string;
  };
}

interface OthersPosts {
  readonly nextPost: Post | null;
  readonly prevPost: Post | null;
}

export default function OthersPosts({
  nextPost,
  prevPost,
}: OthersPosts): JSX.Element {
  return (
    <section className={styles.container}>
      <div className={styles.prev}>
        {prevPost ? (
          <Link href={`/post/${prevPost.uid}`}>
            <a>
              <p>{prevPost.data.title}</p>
              <span>Post anterior</span>
            </a>
          </Link>
        ) : (
          ''
        )}
      </div>
      <div className={styles.next}>
        {nextPost ? (
          <Link as={nextPost.uid} href={`/post/${nextPost.uid}`}>
            <a>
              <p>{nextPost.data.title}</p>
              <span>Próximo post</span>
            </a>
          </Link>
        ) : (
          ''
        )}
      </div>
    </section>
  );
}
