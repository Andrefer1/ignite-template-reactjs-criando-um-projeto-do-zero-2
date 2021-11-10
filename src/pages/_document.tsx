import Document, { Head, Html, Main, NextScript } from 'next/document';
import { getPrismicClient } from '../services/prismic';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: unknown): Promise<unknown> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
            rel="stylesheet"
          />

          <link rel="shortcut icon" href="/favicon.svg" type="image/svg" />
          <script
            async
            defer
            src={`//static.cdn.prismic.io/prismic.js?repo=${getPrismicClient}&new=true`}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
