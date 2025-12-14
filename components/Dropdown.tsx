import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TranslationKey } from '../types';

interface DropdownProps<T extends string> {
  label: TranslationKey;
  value: T | '';
  onChange: (value: T) => void;
  options: readonly T[];
  id: string;
  allowEmpty?: boolean;
  translationPrefix?: string;
}

export const Dropdown = <T extends string>({ 
  label, 
  value, 
  onChange, 
  options, 
  id, 
  allowEmpty = false, 
  translationPrefix 
}: DropdownProps<T>) => {
  const { t } = useLanguage();
  
  const getOptionText = (option: T): string => {
    if (translationPrefix) {
      const key = `${translationPrefix}_${option}` as TranslationKey;
      const translated = t(key);
      // Fallback if translation is missing
      if (translated !== key) return translated;
    }
    // Fallback for options without prefix or translation
    return option.charAt(0).toUpperCase() + option.slice(1);
  }

  return (
    <div>
      <label htmlFor={id} className="block text-base font-medium text-brand-text mb-1">
        {t(label)}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full bg-brand-surface border border-gray-700 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
      >
        {allowEmpty && <option value="">{t('none')}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {getOptionText(option)}
          </option>
        ))}
      </select>
    </div>
  );
};