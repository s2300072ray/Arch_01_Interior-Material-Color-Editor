import React from 'react';
import type { Preset, TranslationKey } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PresetButtonsProps {
  presets: Preset[];
  onPreset: (preset: Preset) => void;
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({ presets, onPreset }) => {
  const { t } = useLanguage();
  return (
    <div>
      <p className="block text-base font-medium text-brand-text mb-2">{t('presetsTitle')}</p>
      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onPreset(preset)}
            className="bg-gray-800 hover:bg-brand-primary/20 text-brand-text-secondary font-semibold py-2 px-3 rounded-lg transition duration-200 text-sm"
          >
            {t(preset.name as TranslationKey)}
          </button>
        ))}
      </div>
    </div>
  );
};