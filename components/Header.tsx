import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as 'en' | 'zh');
  };

  return (
    <header className="bg-brand-surface border-b border-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-brand-text">{t('appTitle')}</h1>
        <div className="flex items-center gap-2">
            <label htmlFor="language-select" className="text-sm font-medium text-brand-text-secondary">{t('language')}:</label>
            <select
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
                className="bg-brand-surface border border-gray-700 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
            >
                <option value="en">English</option>
                <option value="zh">中文</option>
            </select>
        </div>
      </div>
    </header>
  );
};