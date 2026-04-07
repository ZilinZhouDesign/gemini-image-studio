import { NextRequest, NextResponse } from 'next/server';
import { generateImage, AspectRatio, StylePreset } from '@/lib/gemini';

export const runtime = 'edge';

interface GenerateRequest {
  prompt: string;
  mode: 'text-to-image' | 'image-to-image';
  referenceImage?: string;
  style?: StylePreset;
  aspectRatio?: AspectRatio;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, mode, referenceImage, style, aspectRatio } = body;

    // Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Prompt 不能为空', images: [] },
        { status: 400 }
      );
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { status: 'error', message: 'Prompt 不能超过 1000 字符', images: [] },
        { status: 400 }
      );
    }

    if (mode === 'image-to-image' && !referenceImage) {
      return NextResponse.json(
        { status: 'error', message: '图生图模式需要上传参考图', images: [] },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { status: 'error', message: '服务器未配置 Gemini API Key', images: [] },
        { status: 500 }
      );
    }

    // Generate image
    const result = await generateImage({
      prompt: prompt.trim(),
      aspectRatio: aspectRatio || '1:1',
      style,
      referenceImageBase64: mode === 'image-to-image' ? referenceImage : undefined,
      person: true,
    });

    if (!result.images || result.images.length === 0) {
      return NextResponse.json(
        { status: 'error', message: '生成图片失败，请重试', images: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: '图片生成成功',
      images: result.images.map((img) => ({
        url: img.bytes,
        revisedPrompt: prompt,
      })),
    });
  } catch (error) {
    console.error('Image generation error:', error);

    const errorMessage =
      error instanceof Error ? error.message : '未知错误';

    // Handle specific API errors
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return NextResponse.json(
        { status: 'error', message: 'API 配额已用尽，请稍后再试', images: [] },
        { status: 429 }
      );
    }

    if (errorMessage.includes('API key') || errorMessage.includes('auth')) {
      return NextResponse.json(
        { status: 'error', message: 'API Key 无效，请检查配置', images: [] },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { status: 'error', message: `生成失败: ${errorMessage}`, images: [] },
      { status: 500 }
    );
  }
}
