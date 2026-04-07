// apiyi.com - OpenAI compatible Image Generation API
// Base URL: https://api.apiyi.com/v1

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
}

export interface GeneratedImage {
  url: string;
}

function mapAspectToSize(ratio: AspectRatio): string {
  switch (ratio) {
    case '1:1': return '1024x1024';
    case '16:9': return '1536x1024';
    case '9:16': return '1024x1536';
    default: return '1024x1024';
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
  const { prompt, aspectRatio = '1:1', style } = params;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const enhancedPrompt = style ? enhancePrompt(prompt, style) : prompt;
  const size = mapAspectToSize(aspectRatio);

  const response = await fetch('https://api.apiyi.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: enhancedPrompt,
      n: 1,
      size,
      output_format: 'png',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let msg = `API request failed with status ${response.status}`;
    try {
      const err = JSON.parse(errorText);
      if (err.error?.message) msg = err.error.message;
    } catch {}
    throw new Error(msg);
  }

  const data = await response.json();

  if (!data.data || !Array.isArray(data.data) || !data.data[0]) {
    throw new Error('Invalid API response: missing image data');
  }

  return {
    images: data.data.map((item: { url?: string; b64_json?: string }) => ({
      url: item.url || `data:image/png;base64,${item.b64_json}`,
    })),
  };
}
