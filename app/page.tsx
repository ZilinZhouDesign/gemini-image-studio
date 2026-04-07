'use client';

import { useState, useCallback } from 'react';
import { Cpu, GalleryVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import ModeSelector from '@/components/ModeSelector';
import PromptInput from '@/components/PromptInput';
import ImageUploader from '@/components/ImageUploader';
import StyleSelector, { StylePreset } from '@/components/StyleSelector';
import SizeSelector, { AspectRatio } from '@/components/SizeSelector';
import GenerateButton from '@/components/GenerateButton';
import ImageGallery from '@/components/ImageGallery';

interface GeneratedImage {
  url: string;
  revisedPrompt: string;
}

export default function Home() {
  const [mode, setMode] = useState<'text-to-image' | 'image-to-image'>(
    'text-to-image'
  );
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null);
  const [selectedSize, setSelectedSize] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [lastResultCount, setLastResultCount] = useState<number | undefined>();

  const handleGenerate = useCallback(async () => {
    // Validation
    if (!prompt.trim()) {
      toast.error('请输入图片描述');
      return;
    }

    if (mode === 'image-to-image' && !referenceImage) {
      toast.error('请上传参考图片');
      return;
    }

    setIsLoading(true);
    setLastResultCount(undefined);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          mode,
          referenceImage: mode === 'image-to-image' ? referenceImage : undefined,
          style: selectedStyle,
          aspectRatio: selectedSize,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setImages((prev) => [...data.images, ...prev]);
        setLastResultCount(data.images.length);
        toast.success(
          `成功生成 ${data.images.length} 张图片！`,
          { icon: '🎨' }
        );
      } else {
        toast.error(data.message || '生成失败，请重试');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('网络错误，请检查连接后重试');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, mode, referenceImage, selectedStyle, selectedSize]);

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#0F0F0F' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ backgroundColor: 'rgba(15, 15, 15, 0.8)', borderColor: '#2A2A2A' }}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                }}
              >
                <Cpu size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Gemini Image Studio
                </h1>
                <p className="text-xs text-gray-400">AI 图像生成平台</p>
              </div>
            </div>
            <div
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                color: '#8B5CF6',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              Powered by Gemini
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Mode Selector */}
        <section>
          <ModeSelector mode={mode} onModeChange={setMode} />
        </section>

        {/* Prompt Input */}
        <section>
          <PromptInput value={prompt} onChange={setPrompt} />
        </section>

        {/* Reference Image Uploader (only for image-to-image) */}
        {mode === 'image-to-image' && (
          <section className="animate-fadeIn">
            <ImageUploader
              onImageChange={setReferenceImage}
              imagePreview={referenceImage}
            />
          </section>
        )}

        {/* Style Selector */}
        <section
          className="p-4 rounded-xl"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          <StyleSelector
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
          />
        </section>

        {/* Size Selector */}
        <section
          className="p-4 rounded-xl"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          <SizeSelector
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />
        </section>

        {/* Generate Button */}
        <section>
          <GenerateButton
            isLoading={isLoading}
            resultCount={lastResultCount}
            onClick={handleGenerate}
            disabled={!prompt.trim()}
          />
        </section>

        {/* Gallery */}
        {images.length > 0 && (
          <section
            className="p-4 rounded-xl"
            style={{ backgroundColor: '#1A1A1A' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <GalleryVertical size={18} className="text-primary" />
              <h2 className="font-semibold text-white">生成结果</h2>
              <span
                className="ml-auto text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  color: '#8B5CF6',
                }}
              >
                {images.length} 张
              </span>
            </div>
            <ImageGallery images={images} />
          </section>
        )}

        {/* Empty State Gallery Placeholder */}
        {images.length === 0 && (
          <section
            className="p-4 rounded-xl"
            style={{ backgroundColor: '#1A1A1A' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <GalleryVertical size={18} className="text-primary" />
              <h2 className="font-semibold text-white">生成结果</h2>
            </div>
            <ImageGallery images={[]} />
          </section>
        )}

        {/* Tips */}
        <section
          className="p-4 rounded-xl text-xs text-gray-500"
          style={{ backgroundColor: '#1A1A1A' }}
        >
          <p className="font-medium text-gray-400 mb-2">💡 提示</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>文生图模式：输入文字描述，AI 根据描述生成图片</li>
            <li>图生图模式：上传参考图 + 文字描述，AI 基于参考图生成</li>
            <li>选择风格预设可以让生成效果更符合预期</li>
            <li>建议使用英文描述，效果可能更好</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-600">
        <p>Built with Next.js + Gemini Imagen API</p>
        <p className="mt-1">
          Get your API key at{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            aistudio.google.com/apikey
          </a>
        </p>
      </footer>
    </div>
  );
}
