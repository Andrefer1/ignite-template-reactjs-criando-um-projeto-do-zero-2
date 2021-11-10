import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import ExitPreviewModeLink from '../components/ExitPreviewModeLink';
import Datetime from '../components/Datetime';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  const [results, setResults] = useState<Post[]>(postsPagination.results);
  const [nextPageUrl, setNextPageUrl] = useState<string>(
    postsPagination.next_page
  );
  const [lastPage, setLastPage] = useState<boolean>(true);

  useEffect(() => {
    async function FetchAPI(): Promise<void> {
      if (nextPageUrl === null) {
        setLastPage(false);
      }
    }

    FetchAPI();
  }, [nextPageUrl]);

  async function HandleMorePosts(): Promise<void> {
    const postsNextPage = await fetch(nextPageUrl).then(response =>
      response.json()
    );

    setNextPageUrl(postsNextPage.next_page);

    const posts = postsNextPage.results.map((post: Post) => ({
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    }));

    const newResults = [...results];

    posts.map((post: Post) => newResults.push(post));

    setResults(newResults);
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.content}>
          {results.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <h2>{post.data.title}</h2>
                <span>{post.data.subtitle}</span>

                <div className={styles.contentBottom}>
                  <div>
                    <FiCalendar />
                    <Datetime datetime={post.first_publication_date} />
                  </div>
                  <div>
                    <FiUser />
                    <p>{post.data.author}</p>
                  </div>
                </div>
              </a>
            </Link>
          ))}

          {lastPage ? (
            <button type="button" onClick={() => HandleMorePosts()}>
              Carregar mais posts
            </button>
          ) : (
            ''
          )}
        </div>

        <ExitPreviewModeLink preview={preview} />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query('', {
    fetch: ['post.slug', 'post.title', 'post.subtitle', 'post.author'],
    pageSize: 2,
    ref: Object(previewData)?.ref ?? null,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: { postsPagination, preview },
    revalidate: 60 * 60, // 1 hour
  };
};
