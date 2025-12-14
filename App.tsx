import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { ResultDisplay } from './components/ResultDisplay';
import type { EditorState, Preset } from './types';
import { generateImageEdit } from './services/geminiService';
import { PRESETS, DEFAULT_STATE } from './constants';
import { useLanguage } from './context/LanguageContext';

function App() {
  const [editorState, setEditorState] = useState<EditorState>(DEFAULT_STATE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [jsonResponse, setJsonResponse] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const handleStateChange = <K extends keyof EditorState,>(key: K, value: EditorState[K]) => {
    setEditorState(prevState => {
      const newState = { ...prevState, [key]: value };
      if (key === 'target_aspect') {
          const [w, h] = (value as string).split(':').map(Number);
          if (w && h) {
              const baseWidth = 1920;
              newState.output_px_w = baseWidth;
              newState.output_px_h = Math.round(baseWidth * h / w);
          }
      }
      return newState;
    });
  };

  const handleFileChange = (key: keyof EditorState, file: File | null) => {
    setEditorState(prevState => ({ ...prevState, [key]: file }));
  };

  const handlePreset = (preset: Preset) => {
    // Applying a preset clears the selected style to avoid conflicting instructions
    setEditorState(prev => ({...prev, ...preset.settings, selected_style: ''}));
  };

  const handleSubmit = useCallback(async () => {
    if (!editorState.base_image) {
      setError(t('errorBaseImageMissing'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setJsonResponse(null);

    const submissionState = { ...editorState };
    if (!submissionState.useFixedSeed) {
      // Generate a random seed for this specific submission if not fixed
      submissionState.seed = Math.floor(Math.random() * 1000000);
    }

    try {
      const result = await generateImageEdit(submissionState, language);
      if (result.imageB64) {
        setGeneratedImage(`data:image/png;base64,${result.imageB64}`);
      } else {
        setError(t('modelDidNotReturnImage'));
      }
      if (result.json) {
        setJsonResponse(result.json);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t('unknownError'));
    } finally {
      setIsLoading(false);
    }
  }, [editorState, language, t]);


  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <ControlPanel
              state={editorState}
              presets={PRESETS}
              onStateChange={handleStateChange}
              onFileChange={handleFileChange}
              onPreset={handlePreset}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <ResultDisplay
              image={generatedImage}
              json={jsonResponse}
              isLoading={isLoading}
              error={error}
              baseImage={editorState.base_image}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
