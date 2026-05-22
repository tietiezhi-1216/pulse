export const SUPPORTED_LANGUAGES = [
  {
    value: 'system',
    labelKey: 'PREFERENCES.GENERAL.LANGUAGE_SYSTEM',
    fallbackLabel: 'System'
  },
  {
    value: 'en',
    labelKey: 'PREFERENCES.GENERAL.LANGUAGE_ENGLISH',
    fallbackLabel: 'English'
  },
  {
    value: 'zh-CN',
    labelKey: 'PREFERENCES.GENERAL.LANGUAGE_SIMPLIFIED_CHINESE',
    fallbackLabel: 'Simplified Chinese'
  }
];

const SUPPORTED_LANGUAGE_VALUES = new Set(SUPPORTED_LANGUAGES.map((language) => language.value));

export const normalizeLanguage = (language) => {
  if (!language || language === 'system') {
    return 'system';
  }

  if (SUPPORTED_LANGUAGE_VALUES.has(language)) {
    return language;
  }

  if (language.toLowerCase().startsWith('zh')) {
    return 'zh-CN';
  }

  return 'en';
};

const getSystemLanguage = () => {
  return typeof navigator === 'undefined' ? 'en' : navigator.language;
};

export const resolveLanguage = (language, systemLanguage = getSystemLanguage()) => {
  const normalizedLanguage = normalizeLanguage(language);

  if (normalizedLanguage !== 'system') {
    return normalizedLanguage;
  }

  return normalizeLanguage(systemLanguage);
};
