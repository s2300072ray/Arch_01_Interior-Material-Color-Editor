import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TranslationKey } from '../types';

interface SliderProps {
  label: TranslationKey;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  id: string;
}

export const Slider: React.FC<SliderProps> = ({ label, value, onChange, min, max, step, id }) => {
  const { t } = useLanguage();
  return (
    <div>
      <label htmlFor={id} className="flex justify-between text-base font-medium text-brand-text mb-1">
        <span>{t(label)}</span>
        <span>{value}</span>
      </label>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
      />
    </div>
  );
};