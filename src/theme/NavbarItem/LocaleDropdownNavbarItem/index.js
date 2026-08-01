import React, {useState, useRef, useEffect} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import {useHistorySelector} from '@docusaurus/theme-common';
import clsx from 'clsx';
import styles from './styles.module.css';

const FLAG_BASE =
  'https://raw.githubusercontent.com/lipis/flag-icons/086f7e97d657358203916dbe84f61c2bccaa81eb/flags/4x3';

const LOCALE_META = {
  fr: {label: 'FR', flagUrl: `${FLAG_BASE}/fr.svg`},
  en: {label: 'EN', flagUrl: `${FLAG_BASE}/gb.svg`},
};

function getMeta(locale, fallbackLabel) {
  return (
    LOCALE_META[locale] ?? {
      label: (fallbackLabel ?? locale).toUpperCase(),
      flagUrl: null,
    }
  );
}

function Flag({option}) {
  if (!option.flagUrl) {
    return null;
  }
  return (
    <img
      src={option.flagUrl}
      alt={`${option.label} flag`}
      className={styles.flag}
      width={16}
      height={12}
      loading="lazy"
    />
  );
}

export default function LocaleDropdownNavbarItem({
  mobile,
  dropdownItemsBefore = [],
  dropdownItemsAfter = [],
  className,
  position: _position,
  queryString: _queryString,
  label: _label,
  to: _to,
  href: _href,
  ...props
}) {
  const {
    i18n: {currentLocale, locales, localeConfigs},
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();
  const search = useHistorySelector((history) => history.location.search);
  const hash = useHistorySelector((history) => history.location.hash);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const options = locales.map((locale) => ({
    value: locale,
    ...getMeta(locale, localeConfigs[locale]?.label),
    lang: localeConfigs[locale]?.htmlLang ?? locale,
    href:
      alternatePageUtils.createUrl({locale, fullyQualified: false}) +
      search +
      hash,
  }));

  const currentOption =
    options.find((option) => option.value === currentLocale) ?? options[0];

  const orderedOptions = [
    currentOption,
    ...options.filter((option) => option.value !== currentOption.value),
  ];

  if (mobile) {
    return (
      <li className="menu__list-item">
        <ul className={clsx('menu__list', styles.mobileList)}>
          {orderedOptions.map((option) => (
            <li key={option.value} className="menu__list-item">
              <a
                href={option.href}
                target="_self"
                hrefLang={option.lang}
                lang={option.lang}
                className={clsx(
                  'menu__link',
                  styles.mobileLink,
                  option.value === currentLocale && 'menu__link--active',
                )}>
                <Flag option={option} />
                <span>{option.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <div className={clsx(styles.root, className)} ref={dropdownRef} {...props}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Language: ${currentOption.label}`}>
        <span className={styles.triggerContent}>
          <Flag option={currentOption} />
          <span>{currentOption.label}</span>
        </span>
        <svg
          className={clsx(styles.chevron, isOpen && styles.chevronOpen)}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.menu} role="listbox">
          {dropdownItemsBefore}
          {orderedOptions.map((option) => {
            const active = option.value === currentLocale;
            return (
              <a
                key={option.value}
                href={option.href}
                target="_self"
                hrefLang={option.lang}
                lang={option.lang}
                role="option"
                aria-selected={active}
                onClick={() => setIsOpen(false)}
                className={clsx(styles.item, active && styles.itemActive)}>
                <Flag option={option} />
                <span>{option.label}</span>
              </a>
            );
          })}
          {dropdownItemsAfter}
        </div>
      )}
    </div>
  );
}
