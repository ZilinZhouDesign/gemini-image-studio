// jiekou.ai Gemini 3.1 Flash Image Edit API

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
    'cinematic lighting, film grain, 8K, professional color grading, dramatic shadows',
  anime: 'anime style, vibrant colors, detailed illustration, Studio Ghibli inspired',
  photorealistic: 'photorealistic, high detail, professional photography, DSLR quality',
  oil_painting: 'oil painting style, classical art, brushstroke texture, museum quality',
  watercolor: 'watercolor painting style, soft edges, delicate washes, artistic technique',
  cyberpunk: 'cyberpunk style, neon lights, futuristic city, holographic elements',
  ethereal: 'ethereal, dreamlike, soft focus, magical atmosphere, celestial light',
  commercial: 'commercial photography, product shot, studio lighting, advertising quality',
};

export interface GenerateImageParams {
  prompt: string;
  aspectRatio?: AspectRatio;
  style?: StylePreset;
  referenceImageBase64?: string;
}

export interface GeneratedImage {
  url: string;
}

function mapAspectToSize(ratio: AspectRatio): string {
  switch (ratio) {
    case '1:1': return '1K';
    case '16:9': return '16K';
    case '9:16': return '9K';
    default: return '1K';
  }
}

export function enhancePrompt(prompt: string, style: StylePreset): string {
  const enhancement = styleEnhancements[style] || '';
  if (!enhancement) return prompt;
  return `${prompt}. ${enhancement}`;
}

export async function generateImage(
  params: GenerateImageParams
): Promise<{ images: GeneratedImage[] }> {
  const {
    prompt,
    aspectRatio = '1:1',
    style,
    referenceImageBase64,
  } = params;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const enhancedPrompt = style ? enhancePrompt(prompt, style) : prompt;
  const size = mapAspectToSize(aspectRatio);

  const requestBody: Record<string, unknown> = {
    prompt: enhancedPrompt,
    size,
    google: {
      web_search: false,
      image_search: false,
    },
    output_format: 'image/png',
  };

  if (referenceImageBase64) {
    requestBody.image_base64 = referenceImageBase64;
  }

  const response = await fetch('https://api.jiekou.ai/v3/gemini-3.1-flash-image-edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (!data.image_urls || !Array.isArray(data.image_urls)) {
    throw new Error('Invalid API response: missing image_urls');
  }

  return {
    images: data.image_urls.map((url: string) => ({ url })),
  };
}
