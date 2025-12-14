import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { useLanguage } from '../context/LanguageContext';
import { TranslationKey } from '../types';

interface ImageUploaderProps {
  label: TranslationKey;
  instruction: TranslationKey;
  value: File | null;
  onChange: (file: File | null) => void;
  id: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, instruction, value, onChange, id }) => {
  const { t } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };
  
  const handleRemove = () => {
    onChange(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
        onChange(file);
    }
  }, [onChange]);

  return (
    <div>
      <label className="block text-base font-medium text-brand-text mb-1">{t(label)}</label>
      <div 
        className={`relative border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-brand-primary transition-colors ${preview ? 'h-40' : 'h-24'} flex flex-col items-center justify-center`}
        onClick={handleClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
            <button
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 text-xs hover:bg-red-500"
                aria-label="Remove image"
            >
              &#x2715;
            </button>
          </>
        ) : (
          <div className="text-brand-text-secondary">
            <UploadIcon className="w-6 h-6 mx-auto mb-1" />
            <p className="text-sm">{t(instruction)}</p>
          </div>
        )}
      </div>
    </div>
  );
};