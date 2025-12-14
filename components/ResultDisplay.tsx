import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { useLanguage } from '../context/LanguageContext';

interface ResultDisplayProps {
  image: string | null;
  json: object | null;
  isLoading: boolean;
  error: string | null;
  baseImage: File | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, json, isLoading, error, baseImage }) => {
  const { t } = useLanguage();
  const baseImageUrl = baseImage ? URL.createObjectURL(baseImage) : null;

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `interior-design-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-brand-surface rounded-lg p-4 lg:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('outputTitle')}</h2>
        {image && !isLoading && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition duration-300"
          >
            <DownloadIcon className="w-5 h-5" />
            {t('downloadImageButton')}
          </button>
        )}
      </div>
      <div className="flex-grow bg-black/20 rounded-lg flex items-center justify-center relative aspect-video min-h-[300px]">
        {isLoading && (
          <div className="flex flex-col items-center text-brand-text-secondary">
            <SpinnerIcon className="w-12 h-12" />
            <p className="mt-4 text-lg animate-pulse">{t('loadingMessage')}</p>
            <p className="text-sm mt-1">{t('loadingSubMessage')}</p>
          </div>
        )}
        {error && (
          <div className="text-red-400 p-4 text-center">
            <h3 className="font-bold">{t('errorTitle')}</h3>
            <p className="mt-2">{error}</p>
          </div>
        )}
        {!isLoading && !error && !image && (
          <div className="text-center text-brand-text-secondary p-4">
            {baseImageUrl ? (
                <img src={baseImageUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
                <>
                <p className="text-lg">{t('emptyStateTitle')}</p>
                <p>{t('emptyStateSubtitle')}</p>
                </>
            )}
          </div>
        )}
        {image && <img src={image} alt="Generated interior design" className="max-h-full max-w-full object-contain rounded-md" />}
      </div>
      {json && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">{t('jsonTitle')}</h3>
          <pre className="bg-black/30 p-4 rounded-md text-sm text-gray-300 overflow-x-auto">
            {JSON.stringify(json, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};