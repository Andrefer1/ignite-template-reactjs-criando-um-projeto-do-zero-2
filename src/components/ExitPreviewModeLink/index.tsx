import Link from 'next/link';

import styles from './PreviewModeButton.module.scss';

type PreviewModeButtonProps = { preview: boolean };

export default function ExitPreviewModeLink({
  preview,
}: PreviewModeButtonProps): JSX.Element {
  return (
    preview && (
      <div className={styles.container}>
        <Link href="/api/exit-preview">
          <a>
            <span>Sair do modo Preview</span>
          </a>
        </Link>
      </div>
    )
  );
}
