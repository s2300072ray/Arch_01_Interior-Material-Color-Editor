import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TranslationKey } from '../types';

interface ColorPickerProps {
  label: TranslationKey;
  value: string;
  onChange: (value: string) => void;
  id: string;
  disabled?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, id, disabled = false }) => {
    const { t } = useLanguage();
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };
    
    return (
        <div>
            <label htmlFor={id} className="block text-base font-medium text-brand-text mb-1">
                {t(label)}
            </label>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    id={id}
                    value={value}
                    onChange={handleTextChange}
                    className="w-full bg-brand-surface border border-gray-700 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none disabled:opacity-50"
                    placeholder="#RRGGBB"
                    disabled={disabled}
                />
                <div className="relative w-8 h-8 flex-shrink-0">
                    <input
                        type="color"
                        value={value || '#ffffff'}
                        onChange={handleColorChange}
                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                        disabled={disabled}
                    />
                    <div
                        className="w-full h-full rounded-md border border-gray-700"
                        style={{ backgroundColor: value || 'transparent' }}
                    />
                </div>
            </div>
        </div>
    );
};