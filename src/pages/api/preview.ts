/* eslint-disable consistent-return */
import { NextApiRequest, NextApiResponse } from 'next';
import { Document } from '@prismicio/client/types/documents';

import { getPrismicClient } from '../../services/prismic';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> => {
  const { token: ref, documentId } = req.query;

  function linkResolver(doc: Document): string {
    if (doc.type === 'posts') {
      return `/post/${doc.uid}`;
    }
    return '/';
  }

  const redirectUrl = await getPrismicClient(req)
    .getPreviewResolver(String(ref), String(documentId))
    .resolve(linkResolver, '/');

  if (!redirectUrl) {
    return res.status(404).json({ message: 'Invalid token' });
  }

  res.setPreviewData({ ref });

  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${redirectUrl}" />
    <script>window.location.href = '${redirectUrl}'</script>
    </head>`
  );
  res.end();
};
