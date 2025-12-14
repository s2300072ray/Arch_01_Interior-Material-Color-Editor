import React from 'react';
import type { EditorState, Preset, TranslationKey } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ASPECT_RATIOS,
  WOOD_GRAIN_DIRECTIONS,
  FLOOR_MATERIALS,
  LAMP_STYLES,
  BATH_STYLES,
  MASK_MODES,
  INTERIOR_STYLES,
  CINEMATIC_LOOKS,
} from '../constants';

import { ImageUploader } from './ImageUploader';
import { Dropdown } from './Dropdown';
import { Slider } from './Slider';
import { ColorPicker } from './ColorPicker';
import { PresetButtons } from './PresetButtons';
import { StyleSelector } from './StyleSelector';

interface ControlPanelProps {
  state: EditorState;
  presets: Preset[];
  onStateChange: <K extends keyof EditorState>(key: K, value: EditorState[K]) => void;
  onFileChange: (key: keyof EditorState, file: File | null) => void;
  onPreset: (preset: Preset) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const Section: React.FC<{ titleKey: TranslationKey, children: React.ReactNode }> = ({ titleKey, children }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-brand-text mb-4 border-b border-gray-700 pb-2">{t(titleKey)}</h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  presets,
  onStateChange,
  onFileChange,
  onPreset,
  onSubmit,
  isLoading,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-brand-surface p-4 rounded-lg shadow-lg">
      <div className="space-y-6">
        <PresetButtons presets={presets} onPreset={onPreset} />

        <Section titleKey="sectionImageSettings">
          <ImageUploader
            id="base_image"
            label="baseImage"
            instruction="uploadInstruction"
            value={state.base_image}
            onChange={(file) => onFileChange('base_image', file)}
          />
          <Dropdown
            id="target_aspect"
            label="targetAspect"
            value={state.target_aspect}
            onChange={(v) => onStateChange('target_aspect', v)}
            options={ASPECT_RATIOS}
          />
           <div className="flex items-center gap-2">
                <input
                    type="number"
                    id="seed"
                    value={state.seed}
                    onChange={(e) => onStateChange('seed', parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-brand-surface border border-gray-700 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none disabled:opacity-50"
                    disabled={!state.useFixedSeed}
                    aria-label={t('seed')}
                />
                <div className="flex items-center whitespace-nowrap">
                    <input
                        type="checkbox"
                        id="useFixedSeed"
                        checked={state.useFixedSeed}
                        onChange={(e) => onStateChange('useFixedSeed', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <label htmlFor="useFixedSeed" className="ml-2 block text-sm text-brand-text-secondary">
                        {t('useFixedSeed')}
                    </label>
                </div>
            </div>
        </Section>
        
        <StyleSelector styles={INTERIOR_STYLES} selectedStyle={state.selected_style} onSelectStyle={(s) => onStateChange('selected_style', s)} />

        <Section titleKey="sectionMaterialSurface">
            <ColorPicker id="ceiling_color" label="ceilingColor" value={state.ceiling_color_hex} onChange={(v) => onStateChange('ceiling_color_hex', v)} />
            <ColorPicker id="wall_color" label="wallColor" value={state.wall_color_hex} onChange={(v) => onStateChange('wall_color_hex', v)} />
            <ImageUploader id="wall_texture" label="wallTexture" instruction="uploadInstruction" value={state.wall_texture_image} onChange={(f) => onFileChange('wall_texture_image', f)} />
            <ColorPicker id="cabinet_color" label="cabinetColor" value={state.cabinet_color_hex} onChange={(v) => onStateChange('cabinet_color_hex', v)} />
            <ImageUploader id="cabinet_texture" label="cabinetTexture" instruction="uploadInstruction" value={state.cabinet_texture_image} onChange={(f) => onFileChange('cabinet_texture_image', f)} />
            <Dropdown id="wood_grain" label="woodGrainDirection" value={state.wood_grain_direction} onChange={(v) => onStateChange('wood_grain_direction', v)} options={WOOD_GRAIN_DIRECTIONS} translationPrefix="woodGrainDirection" />
            <Dropdown id="floor_material" label="floorMaterial" value={state.floor_material} onChange={(v) => onStateChange('floor_material', v)} options={FLOOR_MATERIALS} allowEmpty translationPrefix="floorMaterial"/>
            <ImageUploader id="floor_texture" label="floorTexture" instruction="uploadInstruction" value={state.floor_texture_image} onChange={(f) => onFileChange('floor_texture_image', f)} />
            <Slider id="roughness" label="roughness" min={0} max={1} step={0.01} value={state.roughness} onChange={(v) => onStateChange('roughness', v)} />
            <Slider id="glossiness" label="glossiness" min={0} max={1} step={0.01} value={state.glossiness} onChange={(v) => onStateChange('glossiness', v)} />
        </Section>
        
        <Section titleKey="sectionLighting">
            <div className="flex items-center gap-2">
                <ColorPicker id="light_color" label="lightColor" value={state.light_color_hex} onChange={(v) => onStateChange('light_color_hex', v)} disabled={state.useLightTemp} />
                <div className="flex items-center whitespace-nowrap pt-5">
                    <input type="checkbox" id="useLightTemp" checked={state.useLightTemp} onChange={(e) => onStateChange('useLightTemp', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    <label htmlFor="useLightTemp" className="ml-2 block text-sm text-brand-text-secondary">{t('useLightTemp')}</label>
                </div>
            </div>
            <Slider id="light_temp" label="lightTemperature" min={1000} max={10000} step={100} value={state.light_temp_k} onChange={(v) => onStateChange('light_temp_k', v)} />
            <Slider id="light_intensity" label="lightIntensity" min={0} max={2} step={0.05} value={state.light_intensity} onChange={(v) => onStateChange('light_intensity', v)} />
            <Dropdown id="lamp_style" label="lampStyle" value={state.lamp_style} onChange={(v) => onStateChange('lamp_style', v)} options={LAMP_STYLES} allowEmpty translationPrefix="lampStyle" />
            <div className="flex items-center">
                <input type="checkbox" id="night_mode" checked={state.night_mode} onChange={(e) => onStateChange('night_mode', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                <label htmlFor="night_mode" className="ml-2 block text-sm text-brand-text-secondary">{t('nightMode')}</label>
            </div>
            <Slider id="shadow_softness" label="shadowSoftness" min={0} max={1} step={0.01} value={state.shadow_softness} onChange={(v) => onStateChange('shadow_softness', v)} />
            <div className="flex items-center">
                <input type="checkbox" id="contact_shadows" checked={state.contact_shadows} onChange={(e) => onStateChange('contact_shadows', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                <label htmlFor="contact_shadows" className="ml-2 block text-sm text-brand-text-secondary">{t('contactShadows')}</label>
            </div>
        </Section>

        <Section titleKey="sectionCinematicEffects">
          <Dropdown
            id="cinematic_look"
            label="cinematicLook"
            value={state.cinematicLook}
            onChange={(v) => onStateChange('cinematicLook', v)}
            options={CINEMATIC_LOOKS}
            allowEmpty
            translationPrefix="cinematicLook"
          />
          <Slider id="bloom" label="bloom" min={0} max={1} step={0.01} value={state.bloom} onChange={(v) => onStateChange('bloom', v)} />
          <Slider id="vignette" label="vignette" min={0} max={1} step={0.01} value={state.vignette} onChange={(v) => onStateChange('vignette', v)} />
          <Slider id="film_grain" label="filmGrain" min={0} max={1} step={0.01} value={state.filmGrain} onChange={(v) => onStateChange('filmGrain', v)} />
          <div className="flex items-center">
            <input type="checkbox" id="lens_flare" checked={state.lensFlare} onChange={(e) => onStateChange('lensFlare', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
            <label htmlFor="lens_flare" className="ml-2 block text-sm text-brand-text-secondary">{t('lensFlare')}</label>
          </div>
        </Section>
        
        <Section titleKey="sectionAdvanced">
            <div className="flex items-center">
                <input type="checkbox" id="bathroom_replace" checked={state.bathroom_replace} onChange={(e) => onStateChange('bathroom_replace', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                <label htmlFor="bathroom_replace" className="ml-2 block text-sm text-brand-text-secondary">{t('bathroomReplace')}</label>
            </div>
            {state.bathroom_replace && (
                <div className="space-y-4 pl-6 border-l-2 border-gray-700 ml-2">
                    <Dropdown id="bath_style" label="bathStyle" value={state.bath_style} onChange={(v) => onStateChange('bath_style', v)} options={BATH_STYLES} allowEmpty translationPrefix="bathStyle" />
                    <ColorPicker id="fixture_color" label="fixtureColor" value={state.fixture_color_hex} onChange={(v) => onStateChange('fixture_color_hex', v)} />
                </div>
            )}
            <Dropdown id="mask_mode" label="maskMode" value={state.mask_mode} onChange={(v) => onStateChange('mask_mode', v)} options={MASK_MODES} translationPrefix="maskMode" />
            {state.mask_mode === 'manual' && (
                <ImageUploader id="mask_image" label="maskImage" instruction="uploadMaskInstruction" value={state.mask_image} onChange={(f) => onFileChange('mask_image', f)} />
            )}
            <div>
                <label htmlFor="negative_prompts" className="block text-base font-medium text-brand-text mb-1">{t('negativePrompts')}</label>
                <textarea id="negative_prompts" rows={3} value={state.negative_prompts} onChange={(e) => onStateChange('negative_prompts', e.target.value)} className="w-full bg-brand-surface border border-gray-700 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none" />
            </div>
        </Section>
        
      </div>
      <div className="mt-8">
        <button
          onClick={onSubmit}
          disabled={isLoading || !state.base_image}
          className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? t('generatingButton') : t('generateButton')}
        </button>
      </div>
    </div>
  );
};