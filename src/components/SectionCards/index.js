import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/**
 * Grid wrapper for the top-level section cards shown on the landing page.
 */
export function SectionCards({children}) {
  return <div className={styles.cards}>{children}</div>;
}

/**
 * A single top-level category entry.
 *
 * @param {{to: string, eyebrow?: string, title: string, meta?: string, children: React.ReactNode}} props
 */
export function SectionCard({to, eyebrow, title, meta, children}) {
  return (
    <Link to={to} className={styles.card}>
      {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
      <span className={styles.title}>{title}</span>
      <span className={styles.body}>{children}</span>
      {meta ? <span className={styles.meta}>{meta}</span> : null}
    </Link>
  );
}

export default SectionCards;
