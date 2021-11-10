import { useEffect } from 'react';

type CommentsProps = { uid: string };

export default function Comments({ uid }: CommentsProps): JSX.Element {
  useEffect(() => {
    const script = document.createElement('script');
    const anchor = document.getElementById('inject-comments-for-uterances');

    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute(
      'repo',
      'Andrefer1/ignite-template-reactjs-criando-um-projeto-do-zero-2'
    );
    script.setAttribute('issue-term', 'title');
    script.setAttribute('theme', 'github-dark');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    anchor.appendChild(script);
  }, [uid]);

  return <div id="inject-comments-for-uterances" />;
}
