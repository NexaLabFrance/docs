import React from 'react';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.copyright}>
            <Translate
              id="footer.copyright"
              description="The footer copyright line"
              values={{year: currentYear}}>
              {'© {year}, NexaLab. All rights reserved.'}
            </Translate>
          </span>
        </div>

        <div className={styles.right}>
          <a
            href="https://nexalab.fr/terms"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer">
            <Translate
              id="footer.terms"
              description="The footer link to the terms of service">
              Terms of General Service
            </Translate>
          </a>
          <span className={styles.separator} aria-hidden="true">
            •
          </span>
          <a
            href="https://nexalab.fr/privacy"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer">
            <Translate
              id="footer.privacy"
              description="The footer link to the privacy policy">
              Privacy Policy
            </Translate>
          </a>
        </div>
      </div>
    </footer>
  );
}
