import React from 'react';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function NavbarLogo() {
  return (
    <a
      href="https://docs.nexalab.fr"
      className={styles.brand}
      aria-label="NexaLab">
      <img
        src="https://nexalab.fr/assets/Logo.svg"
        alt="NexaLab Logo"
        className={styles.logo}
        width={44}
        height={44}
      />
      <div className={styles.text}>
        <span className={styles.title}>NexaLab</span>
        <span className={styles.subtitle}>
          <Translate
            id="navbar.subtitle"
            description="The subtitle shown under the NexaLab wordmark in the navbar">
            Documentation
          </Translate>
        </span>
      </div>
    </a>
  );
}
