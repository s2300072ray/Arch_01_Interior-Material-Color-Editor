import React from 'react';
import type { StyleDefinition, TranslationKey } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface StyleSelectorProps {
  styles: StyleDefinition[];
  selectedStyle: string;
  onSelectStyle: (styleName: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onSelectStyle }) => {
    const { t } = useLanguage();
    
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-brand-text mb-4 border-b border-gray-700 pb-2">{t('sectionStyle')}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {styles.map(style => {
                    const translationKey = `style_${style.name}` as TranslationKey;
                    const translatedName = t(translationKey);
                    return (
                        <button
                            key={style.name}
                            onClick={() => onSelectStyle(style.name)}
                            className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedStyle === style.name ? 'border-brand-primary scale-105' : 'border-transparent hover:border-brand-primary/50'}`}
                            title={translatedName}
                        >
                            <img src={style.previewImage} alt={translatedName} className="w-full h-18 object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-white text-xs font-semibold text-center break-words px-1">{translatedName}</span>
                            </div>
                        </button>
                    )
                })}
                 <button
                    onClick={() => onSelectStyle('')}
                    className={`rounded-lg border-2 flex items-center justify-center text-center text-xs h-18 transition-all duration-200 ${selectedStyle === '' ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-700 bg-brand-surface hover:border-brand-primary/50'}`}
                >
                    {t('none')}
                </button>
            </div>
        </div>
    );
};