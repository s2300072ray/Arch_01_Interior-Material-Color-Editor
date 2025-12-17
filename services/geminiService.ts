import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { EditorState, GeminiResponse } from '../types';

/**
 * Converts a File object to a GoogleGenAI.Part object with base64 encoded data.
 * @param file The file to convert.
 * @returns A promise that resolves to a Part object.
 */
async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // The result includes the data URL prefix (e.g., "data:image/jpeg;base64,"),
        // which we need to remove.
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as a data URL."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}

/**
 * Builds a detailed text prompt in English for the Gemini model.
 * @param state The current state of the editor controls.
 * @returns A string containing the full English prompt.
 */
function buildEnPrompt(state: EditorState): string {
  const nightModeInstruction = state.night_mode
    ? `
- Render a highly realistic and atmospheric nighttime scene.
- Illumination MUST ONLY come from artificial light sources located within the room (e.g., lamps, chandeliers, specified lamp style).
- Do NOT use any ambient daylight. The scene must be lit as if it were completely dark outside.
- This lighting should create a high-contrast effect with distinct, realistic highlights and deep, natural shadows. Areas not directly illuminated by a fixture must be appropriately dark.
`
    : `- Render the scene in a bright, natural daylight setting.`;

  return `**PRIME DIRECTIVE: ABSOLUTE PHOTOREALISM (Enscape/V-Ray Quality)**

**Core Task: Photorealistic "Overpainting" of a Geometric Guide**
The user has provided a **GEOMETRIC GUIDE** image (a 3D model with visible wireframe lines). Your task is to act as a master digital artist performing a photorealistic "render pass" over this guide. You are NOT just editing colors; you are **completely painting over every pixel** of the original image with new, hyper-realistic materials and lighting. The goal is to create an image indistinguishable from a photograph taken of a real space, with the quality of a top-tier rendering engine like **Enscape** or V-Ray.

**NON-NEGOTIABLE RULE #1: OBLITERATE THE WIREFRAME**
This is the most critical instruction. The original wireframe lines are for geometric reference ONLY. They MUST be **completely covered and obliterated** in the final output.
- **FAILURE CONDITION:** If a single artificial line from the guide is visible, the task is a FAILURE.
- **HOW EDGES ARE FORMED:** In your final "painting," edges are defined **ONLY** by the meeting of different material planes and the realistic interaction of light and shadow (especially soft contact shadows). There are NO lines in a photograph.
- **FORBIDDEN ACTION:** Do not trace or preserve the wireframe. Your new "paint" must be so thick and opaque that the underlying guide is 100% invisible.

**Mandatory Rendering Workflow:**
You must follow this professional CGI process strictly.

**Step 1: SCENE RECONSTRUCTION & HYPER-REALISTIC PBR MATERIALS**
- Reconstruct the 3D geometry from the blueprint, but without any of the lines.
- Apply high-quality Physically-Based Rendering (PBR) materials to all surfaces. These materials **MUST** have realistic properties and imperfections.
- **Imperfection is Key:** Surfaces must NOT be perfectly uniform. Add microscopic imperfections: subtle dust, faint scratches, minor smudges, and natural variations in glossiness and color.
- **Material Specifics:** Wood should have visible grain, pores, and slight variations in stain. Metal should have faint anisotropic reflections. Concrete and plaster should show subtle trowel marks and color variations. Fabrics must have visible weave and texture.
- **Reflections:** Shiny surfaces (glass, polished metal, marble) must clearly and accurately reflect their environment with proper Fresnel falloff.

**Step 2: PHYSICALLY-ACCURATE GLOBAL ILLUMINATION (GI)**
- **DISCARD** the original blueprint's lighting.
- Light the scene from scratch using physically accurate GI. Light must behave like real-world photons.
- **Light Bouncing & Color Bleed:** Light must bounce realistically off surfaces, subtly taking on the color of those surfaces and casting it onto nearby objects (color bleed).
- **Shadows:** Ensure soft, diffuse shadows from large light sources (like windows) and sharper, more defined shadows from small, intense sources (like a downlight).

**Step 3: VIRTUAL CAMERA & POST-PROCESSING**
- "Photograph" the rendered scene with a virtual high-end camera (e.g., Sony A7R IV with a 24mm G Master lens).
- Apply subtle, professional camera effects as specified below.

**Cinematic Post-Processing:**
*   **Color Grading:** ${
    state.cinematicLook
      ? `Apply a professional '${state.cinematicLook.replace(/_/g, ' ')}' cinematic color grade.`
      : 'Apply standard professional color grading for a cohesive, atmospheric final image.'
  }
*   **Effects:**
    *   Depth of Field: A slight, natural depth of field (bokeh) is required.
    *   Bloom: ${state.bloom > 0 ? `Apply a soft, physically-based bloom effect to highlights and light sources with an intensity of approximately ${state.bloom}.` : 'No excessive bloom effect.'}
    *   Vignette: ${state.vignette > 0 ? `Add a subtle, optical-style dark vignette at the corners of the image with an intensity of approximately ${state.vignette}.` : 'No noticeable vignette.'}
    *   Film Grain: ${state.filmGrain > 0 ? `Overlay a fine, realistic film grain with an intensity of approximately ${state.filmGrain}.` : 'The image should be clean, without digital noise or artificial grain.'}
    *   Lens Flare: ${state.lensFlare ? 'If there are bright, visible light sources, add a natural and subtle lens flare effect appropriate to a high-end lens.' : 'Avoid adding any artificial lens flare effects.'}

**Immutable Rules:**
- **Window Integrity:** Do NOT alter the window frames, glass, or structure. Treat windows as transparent portals.
- **Outdoor View:** Preserve the original daytime outdoor scenery unless Night Mode is ON, in which case the view must be a realistic nighttime scene.
- **Interior-Only Edits:** All material/style changes apply ONLY to the interior.

**User Specifications for Reconstruction:**
*   **Image Aspect Ratio:** The final image must be strictly rendered in a **${state.target_aspect}** aspect ratio.
*   **Photorealism Framework FIRST:** Before considering style, establish the baseline of absolute photorealism.
*   **Aesthetic Style (Secondary Influence):** After achieving photorealism, use the following style as a guideline for decor, furniture choices, and color palette. The aesthetic style of '${state.selected_style || 'modern'}' must be expressed *through* realistic objects and lighting, not by sacrificing realism itself.
*   **Ambiance:** ${nightModeInstruction}
*   **Ceiling:** ${state.ceiling_color_hex ? `Color: ${state.ceiling_color_hex}.` : 'No specific ceiling color.'}
*   **Walls:** ${state.wall_color_hex ? `Color: ${state.wall_color_hex}.` : 'No specific wall color.'} If wall texture is provided, use it.
*   **Cabinets/Woodwork:** ${state.cabinet_color_hex ? `Color: ${state.cabinet_color_hex}.` : 'No specific cabinet color.'} If cabinet texture is provided, use it. Wood grain direction: **${state.wood_grain_direction}**.
*   **Floor:** ${state.floor_material ? `Material: ${state.floor_material}.` : 'No specific floor material.'} If floor texture is provided, use it.
*   **Surface Finish:** Overall roughness of **${state.roughness}** and glossiness of **${state.glossiness}**.
*   **Lighting:** ${state.useLightTemp ? `Primary light temperature: ${state.light_temp_k}K.` : `Primary light color: ${state.light_color_hex}.`} Intensity: **${state.light_intensity}**.
*   **Shadows:** Overall shadow softness/diffusion must be **${state.shadow_softness}** (0.0 for sharp, 1.0 for very soft). ${state.contact_shadows ? 'Ensure prominent and realistic contact shadows (ambient occlusion) are present where surfaces meet to ground objects.' : 'Use natural, subtle contact shadows.'}
*   **Lamp Fixtures:** ${state.lamp_style ? `Incorporate '${state.lamp_style}' style fixtures.` : 'Use subtle, integrated lighting.'}
*   **Bathroom:** ${state.bathroom_replace ? `Replace fixtures with new ones in a **'${state.bath_style}'** style, colored **${state.fixture_color_hex}**.` : 'Do not modify bathroom fixtures.'}
*   **AVOID (Negative Prompts):** ${state.negative_prompts}, flat lighting, sterile CG look, perfectly clean surfaces, artificial lines.

**JSON Output Requirement:**
After your main instructions, provide a single, clean, parsable JSON object that summarizes the key parameters you applied. Do not include any other text before or after the JSON block.
\`\`\`json
{
  "applied_style": "${state.selected_style || 'modern'}",
  "ambiance": "${state.night_mode ? 'night' : 'day'}",
  "materials": {
    "wall_color": "${state.wall_color_hex || 'unchanged'}",
    "ceiling_color": "${state.ceiling_color_hex || 'unchanged'}",
    "floor_material": "${state.floor_material || 'unchanged'}"
  },
  "lighting": {
    "type": "${state.useLightTemp ? 'temperature' : 'hex'}",
    "value": "${state.useLightTemp ? state.light_temp_k : state.light_color_hex}",
    "intensity": ${state.light_intensity},
    "shadow_softness": ${state.shadow_softness},
    "contact_shadows": ${state.contact_shadows}
  },
  "cinematic_effects": {
    "look": "${state.cinematicLook || 'none'}",
    "film_grain": ${state.filmGrain},
    "vignette": ${state.vignette},
    "bloom": ${state.bloom},
    "lens_flare": ${state.lensFlare}
  }
}
\`\`\`
`.trim();
}

/**
 * Builds a detailed text prompt in Chinese for the Gemini model.
 * @param state The current state of the editor controls.
 * @returns A string containing the full Chinese prompt.
 */
function buildZhPrompt(state: EditorState): string {
  const nightModeInstruction = state.night_mode
    ? `
- 渲染一個高度真實且富有氛圍的夜間場景。
- 照明「只能」來自房間內部的人造光源（例如：檯燈、吊燈、指定的燈具風格）。
- 「絕對不要」使用任何環境日光。場景必須被照亮得如同室外完全黑暗一樣。
- 這種照明應創造出高對比度的效果，具有清晰、真實的高光和深邃、自然的陰影。未被燈具直接照射的區域必須是適當的暗度。
`
    : `- 在明亮的自然日光設定下渲染場景。`;

  const getZhCinematicLook = (look: EditorState['cinematicLook']): string => {
    switch(look) {
        case 'teal_orange': return '青橙色調 (Teal & Orange)';
        case 'film_noir': return '黑色電影 (Film Noir)';
        case 'vintage_film': return '復古膠片 (Vintage Film)';
        case 'cyberpunk_neon': return '賽博龐克霓虹 (Cyberpunk Neon)';
        default: return '';
    }
  }
  const cinematicLookZh = getZhCinematicLook(state.cinematicLook);
    
  return `**首要指令：絕對的照片級真實感 (Enscape/V-Ray 品質)**

**核心任務：對幾何指南進行照片級“覆蓋繪製”**
使用者提供了一張「幾何指南」圖像（一個帶有可見線框的3D模型）。你的任務是扮演一位大師級的數位藝術家，對這份指南進行照片級的“渲染遍歷”。你不僅僅是編輯顏色；你是在用全新的、超真實的材質和光影「完全覆蓋繪製原始圖像的每一個像素」。目標是創造出一張與真實空間的照片無法區分的圖像，其品質要達到像 **Enscape** 或 V-Ray 這樣的頂級渲染引擎水準。

**不可協商規則 #1：徹底消除線框**
這是最關鍵的指令。原始的線框線條「僅供幾何參考」。在最終輸出中，它們必須被「完全覆蓋並徹底清除」。
- **失敗條件：** 如果最終成品中出現任何一條來自指南的人工線條，則任務視為「失敗」。
- **邊緣的形成方式：** 在你最終的“畫作”中，邊緣「只能」由不同材質平面的交界以及光影的真實互動（特別是柔和的接觸陰影）來定義。照片中沒有線條。
- **禁止行為：** 不要描摹或保留線框。你新的“顏料”必須厚實且不透明，以至於底層的指南100%不可見。

**強制性渲染工作流程：**
你必須嚴格遵循這個專業的CGI流程。

**步驟一：場景重建與超真實的PBR材質**
- 根據藍圖重建3D幾何結構，但要完全去掉所有線條。
- 為所有表面應用高品質的基於物理的渲染 (PBR) 材質。這些材質「必須」具有真實的屬性和瑕疵。
- **瑕疵是關鍵：** 表面「絕不能」是完美均勻的。加入微觀的瑕疵：細微的灰塵、輕微的刮痕、微小的污跡，以及光澤度和顏色上的自然變化。
- **材質細節：** 木材應有可見的紋理、毛孔和染色上的輕微變化。金屬應有微弱的各向異性反射。混凝土和石膏應顯示出細微的鏝刀痕跡和顏色變化。織物必須有可見的編織紋理。
- **反射：** 光亮的表面（玻璃、拋光金屬、大理石）必須清晰且準確地反射其周遭環境，並具有正確的菲涅爾衰減效果。

**步驟二：物理準確的全域照明 (GI)**
- 「拋棄」藍圖原始的燈光設定。
- 使用物理準確的全域照明從頭開始為場景布光。光線的行為必須如同真實世界的光子。
- **光線反彈與色彩溢出：** 光線必須能夠在物體表面之間真實地反彈，並巧妙地吸收這些表面的顏色，將其投射到附近的物體上（色彩溢出）。
- **陰影：** 確保來自大型光源（如窗戶）的陰影是柔和、漫反射的，而來自小型、強烈光源（如嵌燈）的陰影則更為銳利、清晰。

**步驟三：虛擬相機與後期處理**
- 用一個虛擬的高階相機（例如：配備 24mm G Master 鏡頭的 Sony A7R IV）來「拍攝」渲染好的場景。
- 應用下方指定的微妙且專業的相機效果。

**電影級後期處理:**
*   **色彩分級:** ${cinematicLookZh ? `套用專業的 '${cinematicLookZh}' 電影色彩風格。` : '套用標準的專業色彩分級，以打造有凝聚力、有氛圍的最終圖像。'}
*   **效果:**
    *   景深: 需要輕微、自然的景深效果 (散景)。
    *   光暈 (Bloom): ${state.bloom > 0 ? `為高光和光源應用基於物理的柔和光暈效果，強度約為 ${state.bloom}。` : '無過度的光暈效果。'}
    *   暗角 (Vignette): ${state.vignette > 0 ? `在圖像角落添加細微、光學風格的暗角，強度約為 ${state.vignette}。` : '無明顯的暗角。'}
    *   膠片顆粒 (Film Grain): ${state.filmGrain > 0 ? `疊加一層細膩、真實的膠片顆粒，強度約為 ${state.filmGrain}。` : '圖像應該乾淨，沒有數位雜訊或人工顆粒。'}
    *   鏡頭光暈 (Lens Flare): ${state.lensFlare ? '如果有明亮可見的光源，從它們發出適合高階鏡頭的自然且細微的鏡頭光暈效果。' : '避免添加任何人工的鏡頭光暈效果。'}

**不變的規則：**
- **窗戶完整性：** 「絕對不能」更改窗框、玻璃或其結構。將窗戶視為透明的通道。
- **戶外景觀：** 保留原始的白天戶外景色，除非「夜間模式」開啟，此時景觀必須是真實的夜景。
- **僅限室內編輯：** 所有的材質/風格變更「僅適用於」室內。

**使用者指定的重建參數：**
*   **圖片長寬比：** 最終圖片必須嚴格以 **${state.target_aspect}** 的長寬比渲染。
*   **照片真實感框架優先：** 在考慮風格之前，先建立絕對照片級真實感的基準。
*   **美學風格 (次要影響)：** 在實現照片真實感之後，使用以下風格作為裝飾、家具選擇和調色板的指導方針。'${state.selected_style || '現代風'}' 的美學風格必須「透過」真實的物體和光線來表達，而不是犧牲真實感本身。
*   **氛圍：** ${nightModeInstruction}
*   **天花板：** ${state.ceiling_color_hex ? `顏色: ${state.ceiling_color_hex}。` : '不指定天花板顏色。'}
*   **牆壁：** ${state.wall_color_hex ? `顏色: ${state.wall_color_hex}。` : '不指定牆壁顏色。'} 如果提供了牆壁紋理，請使用它。
*   **櫥櫃/木製品：** ${state.cabinet_color_hex ? `顏色: ${state.cabinet_color_hex}。` : '不指定櫥櫃顏色。'} 如果提供了櫥櫃紋理，請使用它。木紋方向: **${state.wood_grain_direction === 'vertical' ? '垂直' : '水平'}**。
*   **地板：** ${state.floor_material ? `材質: ${state.floor_material}。` : '不指定地板材質。'} 如果提供了地板紋理，請使用它。
*   **表面處理：** 整體粗糙度為 **${state.roughness}**，光澤度為 **${state.glossiness}**。
*   **照明：** ${state.useLightTemp ? `主要光溫: ${state.light_temp_k}K。` : `主要光色: ${state.light_color_hex}。`} 強度: **${state.light_intensity}**。
*   **陰影:** 整體陰影的柔和/擴散度必須為 **${state.shadow_softness}** (0.0 為銳利, 1.0 為非常柔和)。${state.contact_shadows ? '確保在物體表面相接處有顯著且真實的接觸陰影（環境光遮蔽），以增加物體的落地感。' : '使用自然、細膩的接觸陰影。'}
*   **燈具：** ${state.lamp_style ? `融入 '${state.lamp_style}' 風格的燈具。` : '使用細微的、整合式的照明。'}
*   **浴室：** ${state.bathroom_replace ? `將衛浴設備更換為 **'${state.bath_style}'** 風格、顏色為 **${state.fixture_color_hex}** 的新設備。` : '不要修改浴室設備。'}
*   **避免 (負面提示):** ${state.negative_prompts}，平面光，呆板的 CG 感，過於乾淨的表面，人工線條。

**JSON 輸出要求：**
在主要說明之後，提供一個單一、乾淨、可解析的 JSON 物件，總結您為此次生成所套用的關鍵參數。請勿在 JSON 區塊前後包含任何其他文字。
\`\`\`json
{
  "applied_style": "${state.selected_style || 'modern'}",
  "ambiance": "${state.night_mode ? 'night' : 'day'}",
  "materials": {
    "wall_color": "${state.wall_color_hex || 'unchanged'}",
    "ceiling_color": "${state.ceiling_color_hex || 'unchanged'}",
    "floor_material": "${state.floor_material || 'unchanged'}"
  },
  "lighting": {
    "type": "${state.useLightTemp ? 'temperature' : 'hex'}",
    "value": "${state.useLightTemp ? state.light_temp_k : state.light_color_hex}",
    "intensity": ${state.light_intensity},
    "shadow_softness": ${state.shadow_softness},
    "contact_shadows": ${state.contact_shadows}
  },
  "cinematic_effects": {
    "look": "${state.cinematicLook || 'none'}",
    "film_grain": ${state.filmGrain},
    "vignette": ${state.vignette},
    "bloom": ${state.bloom},
    "lens_flare": ${state.lensFlare}
  }
}
\`\`\`
`.trim();
}


/**
 * Builds a detailed text prompt for the Gemini model based on the editor state and language.
 * @param state The current state of the editor controls.
 * @param language The user's selected language ('en' or 'zh').
 * @returns A string containing the full prompt.
 */
function buildPrompt(state: EditorState, language: string): string {
  if (language === 'zh') {
    return buildZhPrompt(state);
  }
  return buildEnPrompt(state);
}

/**
 * Calls the Gemini API to edit an image based on the provided editor state.
 * @param state The current state of the editor controls.
 * @param language The user's selected language.
 * @returns A promise that resolves to a GeminiResponse object containing the edited image and JSON data.
 */
export const generateImageEdit = async (state: EditorState, language: string): Promise<GeminiResponse> => {
  // Security Check: Ensure API key is present in environment before making any calls.
  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please ensure process.env.API_KEY is configured.");
  }

  // Initialize the client inside the function to use the current environment variable.
  // This prevents issues with strict-mode checking and ensures the key is not leaked in global scope.
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

  if (!state.base_image) {
    throw new Error("Base image is missing.");
  }

  // Use the standard Flash Image model for efficiency and cost-effectiveness.
  const imageEditModel = 'gemini-2.5-flash-image';

  const parts: Part[] = [];

  // 1. Add the base image for editing.
  const imagePart = await fileToGenerativePart(state.base_image);
  parts.push(imagePart);
  
  // 2. Conditionally add texture images if they are provided by the user.
  if (state.wall_texture_image) {
    parts.push({ text: "Use the following image as a texture for the walls:" });
    parts.push(await fileToGenerativePart(state.wall_texture_image));
  }
  if (state.cabinet_texture_image) {
    parts.push({ text: "Use the following image as a texture for the cabinets:" });
    parts.push(await fileToGenerativePart(state.cabinet_texture_image));
  }
  if (state.floor_texture_image) {
    parts.push({ text: "Use the following image as a texture for the floor:" });
    parts.push(await fileToGenerativePart(state.floor_texture_image));
  }

  // 3. Add the mask image if manual masking is enabled.
  if (state.mask_mode === 'manual' && state.mask_image) {
    parts.push({ text: "IMPORTANT: Apply edits ONLY to the white areas of the following mask image:" });
    parts.push(await fileToGenerativePart(state.mask_image));
  }

  // 4. Add the main text prompt with all the instructions.
  const prompt = buildPrompt(state, language);
  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
      model: imageEditModel,
      contents: { parts },
      // The config must specify that we expect both an image and text in the response.
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
  });

  let imageB64: string | null = null;
  let json: object | null = null;
  
  // Process the response from the model.
  if (response.candidates && response.candidates.length > 0) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        // This part contains the generated image data.
        imageB64 = part.inlineData.data;
      } else if (part.text) {
        // This part contains text, which should include our requested JSON object.
        try {
          // Extract the JSON string from within the code block.
          const jsonStringMatch = part.text.match(/```json\n([\s\S]*?)\n```/);
          if (jsonStringMatch && jsonStringMatch[1]) {
            json = JSON.parse(jsonStringMatch[1]);
          }
        } catch (e) {
          console.error("Failed to parse JSON from model response:", e);
          // Don't throw an error; the image might still be valid.
        }
      }
    }
  }

  return { imageB64, json };
};