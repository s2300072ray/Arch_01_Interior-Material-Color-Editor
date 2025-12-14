// FIX: Changed TranslationKey to be an alias for string to avoid circular dependencies.
export type TranslationKey = string;

export interface EditorState {
  base_image: File | null;
  target_aspect: '16:9' | '4:3' | '1:1' | '21:9' | '2.39:1';
  output_px_w: number;
  output_px_h: number;
  variations: number;
  seed: number;
  useFixedSeed: boolean;
  
  ceiling_color_hex: string;
  wall_color_hex: string;
  wall_texture_image: File | null;
  cabinet_color_hex: string;
  cabinet_texture_image: File | null;
  wood_grain_direction: 'vertical' | 'horizontal';
  floor_material: 'wood' | 'marble' | 'tile' | 'concrete' | '';
  floor_texture_image: File | null;
  roughness: number;
  glossiness: number;
  
  light_color_hex: string;
  light_temp_k: number;
  useLightTemp: boolean;
  light_intensity: number;
  lamp_style: 'downlight' | 'track' | 'chandelier' | 'panel' | '';
  shadow_softness: number;
  contact_shadows: boolean;
  
  bathroom_replace: boolean;
  bath_style: 'modern' | 'minimal' | 'classic' | '';
  fixture_color_hex: string;
  
  mask_mode: 'auto' | 'manual';
  mask_image: File | null;
  negative_prompts: string;

  // New properties for styles and ambiance
  selected_style: string;
  night_mode: boolean;

  // Cinematic Effects
  cinematicLook: 'teal_orange' | 'film_noir' | 'vintage_film' | 'cyberpunk_neon' | '';
  filmGrain: number;
  vignette: number;
  bloom: number;
  lensFlare: boolean;
}

export interface Preset {
  name: string;
  settings: Partial<EditorState>;
}

export interface GeminiResponse {
  imageB64: string | null;
  json: object | null;
}

export interface StyleDefinition {
  name: string;
  previewImage: string;
}