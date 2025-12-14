import type { EditorState, Preset, StyleDefinition } from './types';

export const DEFAULT_STATE: EditorState = {
  base_image: null,
  target_aspect: '16:9',
  output_px_w: 1920,
  output_px_h: 1080,
  variations: 1,
  seed: 42,
  useFixedSeed: true,

  ceiling_color_hex: '#FFFFFF',
  wall_color_hex: '',
  wall_texture_image: null,
  cabinet_color_hex: '',
  cabinet_texture_image: null,
  wood_grain_direction: 'vertical',
  floor_material: '',
  floor_texture_image: null,
  roughness: 0.4,
  glossiness: 0.35,

  light_color_hex: '',
  light_temp_k: 4000,
  useLightTemp: true,
  light_intensity: 0.6,
  lamp_style: '',
  shadow_softness: 0.5,
  contact_shadows: true,

  bathroom_replace: false,
  bath_style: '',
  fixture_color_hex: '#FFFFFF',

  mask_mode: 'auto',
  mask_image: null,
  negative_prompts: 'cartoon, over-saturated, plastic, distorted perspective',

  selected_style: '',
  night_mode: false,

  // Cinematic defaults
  cinematicLook: '',
  filmGrain: 0.1,
  vignette: 0.2,
  bloom: 0.15,
  lensFlare: false,
};

export const PRESETS: Preset[] = [
  {
    name: 'presetMinimal',
    settings: {
      wall_color_hex: '#F5F5F3',
      ceiling_color_hex: '#FFFFFF',
      cabinet_color_hex: '#C6AE8B',
      wood_grain_direction: 'vertical',
      floor_material: 'wood',
      roughness: 0.45,
      glossiness: 0.25,
      useLightTemp: true,
      light_temp_k: 3200,
      light_intensity: 0.6,
      lamp_style: 'downlight',
      target_aspect: '16:9',
      output_px_w: 1920,
      output_px_h: 1080,
      seed: 42,
      useFixedSeed: true,
    },
  },
  {
    name: 'presetBusiness',
    settings: {
      wall_color_hex: '#EDEDED',
      ceiling_color_hex: '#FFFFFF',
      cabinet_color_hex: '#3A3A3A',
      floor_material: 'marble',
      glossiness: 0.6,
      useLightTemp: true,
      light_temp_k: 3800,
      lamp_style: 'panel',
      light_intensity: 0.55,
      seed: 101,
      useFixedSeed: true,
    },
  },
  {
    name: 'presetIndustrial',
    settings: {
      wall_color_hex: '#D9D9D9',
      ceiling_color_hex: '#2B2B2B',
      cabinet_color_hex: '#4A4A4A',
      floor_material: 'concrete',
      roughness: 0.65,
      glossiness: 0.15,
      useLightTemp: false,
      light_color_hex: '#FFD8A8',
      lamp_style: 'track',
      light_intensity: 0.7,
      seed: 204,
      useFixedSeed: true,
    },
  },
];

export const ASPECT_RATIOS: EditorState['target_aspect'][] = ['16:9', '21:9', '2.39:1', '4:3', '1:1'];
export const WOOD_GRAIN_DIRECTIONS: EditorState['wood_grain_direction'][] = ['vertical', 'horizontal'];
export const FLOOR_MATERIALS: EditorState['floor_material'][] = ['wood', 'marble', 'tile', 'concrete'];
export const LAMP_STYLES: EditorState['lamp_style'][] = ['downlight', 'track', 'chandelier', 'panel'];
export const BATH_STYLES: EditorState['bath_style'][] = ['modern', 'minimal', 'classic'];
export const MASK_MODES: EditorState['mask_mode'][] = ['auto', 'manual'];
export const CINEMATIC_LOOKS: EditorState['cinematicLook'][] = ['teal_orange', 'film_noir', 'vintage_film', 'cyberpunk_neon'];

export const SIZE_SUGGESTIONS: Record<EditorState['target_aspect'], string> = {
    '16:9': '1920×1080, 2560×1440, 3840×2160',
    '4:3': '1600×1200, 2048×1536',
    '1:1': '1080×1080, 2048×2048',
    '21:9': '2560×1080, 3440×1440',
    '2.39:1': '2560×1071, 3840×1607',
};

export const INTERIOR_STYLES: StyleDefinition[] = [
  { name: 'Modern', previewImage: 'https://picsum.photos/seed/modern/100/75' },
  { name: 'Minimalist', previewImage: 'https://picsum.photos/seed/minimalist/100/75' },
  { name: 'Industrial', previewImage: 'https://picsum.photos/seed/industrial/100/75' },
  { name: 'Scandinavian', previewImage: 'https://picsum.photos/seed/scandinavian/100/75' },
  { name: 'Bohemian', previewImage: 'https://picsum.photos/seed/bohemian/100/75' },
  { name: 'Coastal', previewImage: 'https://picsum.photos/seed/coastal/100/75' },
  { name: 'Farmhouse', previewImage: 'https://picsum.photos/seed/farmhouse/100/75' },
  { name: 'MidCenturyModern', previewImage: 'https://picsum.photos/seed/midcentury/100/75' },
  { name: 'ArtDeco', previewImage: 'https://picsum.photos/seed/artdeco/100/75' },
  { name: 'Japandi', previewImage: 'https://picsum.photos/seed/japandi/100/75' },
  { name: 'Maximalist', previewImage: 'https://picsum.photos/seed/maximalist/100/75' },
  { name: 'Gothic', previewImage: 'https://picsum.photos/seed/gothic/100/75' },
  { name: 'Cyberpunk', previewImage: 'https://picsum.photos/seed/cyberpunk/100/75' },
  { name: 'Steampunk', previewImage: 'https://picsum.photos/seed/steampunk/100/75' },
  { name: 'HollywoodRegency', previewImage: 'https://picsum.photos/seed/hollywood/100/75' },
  { name: 'Rustic', previewImage: 'https://picsum.photos/seed/rustic/100/75' },
  { name: 'ShabbyChic', previewImage: 'https://picsum.photos/seed/shabbychic/100/75' },
  { name: 'Transitional', previewImage: 'https://picsum.photos/seed/transitional/100/75' },
  { name: 'Tropical', previewImage: 'https://picsum.photos/seed/tropical/100/75' },
  { name: 'Victorian', previewImage: 'https://picsum.photos/seed/victorian/100/75' },
  { name: 'Zen', previewImage: 'https://picsum.photos/seed/zen/100/75' },
];