import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import readingTime from 'reading-time/lib/reading-time';
import { useRouter } from 'next/router';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../services/prismic';
import useUpdatePreviewRef from '../../utils/useUpdatePreviewRef';
import Loader from '../../components/loader';
import Custom404 from '../404';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Comments from '../../components/Comments';
import Datetime from '../../components/Datetime';
import OthersPosts from '../../components/OthersPosts';

interface Post {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner?: {
      url: string;
    };
    author?: string;
    content?: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  previewRef: string | null;
  readonly nextPost: Pick<Post, 'uid' | 'data'> | null;
  readonly prevPost: Pick<Post, 'uid' | 'data'> | null;
}

interface GStaticProps {
  props: PostProps;
  revalidate: number;
}

export default function Post({
  post,
  previewRef,
  nextPost,
  prevPost,
}: PostProps): JSX.Element {
  const [minutesLecture, setMinutesLecture] = useState<number>(0);
  const router = useRouter();
  useUpdatePreviewRef(previewRef, post.uid);

  if (router.isFallback) {
    return <Loader />;
  }

  if (!post) {
    return <Custom404 />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const text = post.data.content.map(content =>
      content.body.map(e => e.text).join()
    );

    const allText = text.map(e => e).join();

    const { minutes } = readingTime(allText);

    const [min, sec] = String(minutes).split('.');

    const totalMin = Number(sec) === 0 ? Number(min) : Number(min) + 2;

    setMinutesLecture(totalMin);
  }, [post.data.content]);

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>

      <div className={commonStyles.container}>
        <div className={styles.content}>
          <div className={styles.imagePost}>
            <img
              className={styles.banner}
              src={post.data.banner.url}
              alt="Imagem do post"
            />
          </div>

          <header>
            <h1>{post.data.title}</h1>
            <div>
              <div>
                <FiCalendar />
                <Datetime datetime={post.first_publication_date} />
              </div>
              <div>
                <FiUser />
                <p>{post.data.author}</p>
              </div>
              <div>
                <FiClock />
                <time>{minutesLecture} min</time>
              </div>
            </div>
            <span>
              * editado em{' '}
              <Datetime datetime={post.last_publication_date} hour={false} />
            </span>
          </header>

          {post.data.content.map(content => (
            <div key={content.heading} className={styles.textContent}>
              <h2>{content.heading}</h2>
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: content.body.map(e => e.text).join('<br /><br />'),
                }}
              />
            </div>
          ))}
        </div>

        <OthersPosts nextPost={nextPost} prevPost={prevPost} />

        <Comments uid={post.uid} />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query('', {
    fetch: ['post.slug'],
  });

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  previewData,
}): Promise<GStaticProps> => {
  const { slug } = params;
  const previewRef = previewData ? Object(previewData).ref : null;
  const refOption = previewRef ? { ref: previewRef } : null;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID(
    'post',
    String(slug),
    refOption || {}
  );

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(
        (content: { heading: string; body: [] }) => ({
          heading: content.heading,
          body: content.body,
        })
      ),
    },
  };

  const prevResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
    }
  );

  const prevRes = prevResponse?.results[0];

  const prevPost = prevResponse?.results[0]
    ? {
        uid: prevRes.uid,
        data: {
          title: prevRes.data.title,
        },
      }
    : null;

  const nextResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date desc]',
    }
  );

  const nextRes = nextResponse.results[0];

  const nextPost = nextResponse.results[0]
    ? {
        uid: nextRes.uid,
        data: {
          title: nextRes.data.title,
        },
      }
    : null;

  return {
    props: { post, previewRef, nextPost, prevPost },
    revalidate: 60 * 60, // 1 hour
  };
};
