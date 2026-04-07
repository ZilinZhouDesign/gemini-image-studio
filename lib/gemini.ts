// Gemini Imagen API - Direct REST API implementation
// Based on Google AI Imagen API

export type AspectRatio = '1:1' | '16:9' | '9:16';
export type StylePreset =
  | 'cinematic'
  | 'anime'
  | 'photorealistic'
  | 'oil_painting'
  | 'watercolor'
  | 'cyberpunk'
  | 'ethereal'
  | 'commercial';

// Style enhancement prompts
const styleEnhancements: Record<StylePreset, string> = {
  cinematic:
    'cinematic lighting, film grain, 8K, professional color grading, dramatic shadows, anamorphic lens flare, movie still quality',
  anime:
    'anime style, vibrant colors, detailed illustration, Studio Ghibli inspired, cel shaded, high quality anime artwork',
  photorealistic:
    'photorealistic, high detail, professional photography, DSLR quality, sharp focus, natural lighting, ultra realistic',
  oil_painting:
    'oil painting style, classical art, brushstroke texture, rich colors, museum quality, Renaissance inspired, thick impasto',
  watercolor:
    'watercolor painting style, soft edges, delicate washes, artistic technique, paper texture visible, ethereal quality',
  cyberpunk:
    'cyberpunk style, neon lights, futuristic city, holographic elements, rain-soaked streets, chrome details, dystopian',
  ethereal:
    'ethereal, dreamlike, soft focus, magical atmosphere, celestial light, mystical, fairytale quality, bokeh',
  commercial:
    'commercial photography, product shot, studio lighting, advertising quality, clean background, professional retouching, magazine cover',
};

export interface GenerateImageParams {
  prompt: string;
  model?: string;
  aspectRatio?: AspectRatio;
  person?: boolean;
  style?: StylePreset;
  referenceImageBase64?: string;
}

export interface GeneratedImage {
  bytes: string;
  mimeType: string;
}

function mapAspectRatio(ratio: AspectRatio): string {
  switch (ratio) {
    case '1:1':
      return '1024x1024';
    case '16:9':
      return '1792x1024';
    case '9:16':
      return '1024x1792';
    default:
      return '1024x1024';
  }
}

export function enhancePrompt(prompt: string, style: StylePreset): string {
  const enhancement = styleEnhancements[style] || '';
  if (!enhancement) return prompt;
  return `${prompt}. ${enhancement}`;
}

const API_BASE = 'https://generativelanguage.googleapis.com';

export async function generateImage(
  params: GenerateImageParams
): Promise<{ images: GeneratedImage[] }> {
  const {
    prompt,
    model = 'imagen-3.0-generate-002',
    aspectRatio = '1:1',
    person = true,
    style,
    referenceImageBase64,
  } = params;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  // Enhance prompt with style
  const enhancedPrompt = style ? enhancePrompt(prompt, style) : prompt;

  const outputDimensions = mapAspectRatio(aspectRatio);

  let requestBody: Record<string, unknown>;

  if (referenceImageBase64) {
    // Image-to-image mode - convert base64 to binary bytes
    const base64Data = referenceImageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    requestBody = {
      prompt: enhancedPrompt,
      image: {
        imageBytes: Array.from(imageBytes),
      },
      outputConfig: {
        numberOfImages: 1,
        outputDimensions,
        personGeneration: person ? 'allow' : 'donotallow',
      },
    };
  } else {
    // Text-to-image mode
    requestBody = {
      prompt: enhancedPrompt,
      outputConfig: {
        numberOfImages: 1,
        outputDimensions,
        personGeneration: person ? 'allow' : 'donotallow',
      },
    };
  }

  const url = `${API_BASE}/v1beta/${model}:generateImages?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API request failed with status ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error?.message) {
        errorMessage = errorJson.error.message;
      }
    } catch {
      // Use default error message
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  const images: GeneratedImage[] =
    data.generatedImages?.map((img: { image: { imageBytes?: string; bytes?: string; mimeType?: string } }) => {
      const rawBytes = img.image.imageBytes || img.image.bytes || '';
      return {
        bytes: `data:${img.image.mimeType || 'image/png'};base64,${Buffer.from(rawBytes).toString('base64')}`,
        mimeType: img.image.mimeType || 'image/png',
      };
    }) || [];

  return { images };
}
