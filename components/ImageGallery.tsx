'use client';

import { useState, useEffect } from 'react';
import { X, Download, ImageIcon } from 'lucide-react';

interface GalleryImage {
  url: string;
  revisedPrompt: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxImage]);

  const handleDownload = (image: GalleryImage, index: number) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `gemini-image-${Date.now()}-${index + 1}.png`;
    link.click();
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="p-6 rounded-2xl mb-4"
          style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
        >
          <ImageIcon size={48} className="text-primary opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">
          还没有生成的图片
        </h3>
        <p className="text-sm text-gray-500 max-w-xs">
          输入描述文字，选择风格和尺寸，点击生成按钮开始创作你的第一张 AI 图片
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group rounded-xl overflow-hidden animate-fadeIn cursor-pointer"
            style={{
              backgroundColor: '#1A1A1A',
              animationDelay: `${index * 100}ms`,
            }}
            onClick={() => setLightboxImage(image)}
          >
            <img
              src={image.url}
              alt={image.revisedPrompt}
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute bottom-2 right-2 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image, index);
                  }}
                  className="p-2 rounded-lg bg-black/60 hover:bg-black/80 transition-colors"
                  title="下载图片"
                >
                  <Download size={16} className="text-white" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2 right-10">
                <p className="text-xs text-white/80 line-clamp-2">
                  {image.revisedPrompt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors z-10"
            onClick={() => setLightboxImage(null)}
          >
            <X size={24} className="text-white" />
          </button>

          <button
            className="absolute bottom-4 right-4 p-3 rounded-xl bg-primary hover:bg-primary/80 transition-colors flex items-center gap-2 z-10"
            onClick={(e) => {
              e.stopPropagation();
              const idx = images.findIndex(
                (img) => img.url === lightboxImage.url
              );
              handleDownload(lightboxImage, idx);
            }}
          >
            <Download size={20} className="text-white" />
            <span className="text-white font-medium">下载</span>
          </button>

          <img
            src={lightboxImage.url}
            alt={lightboxImage.revisedPrompt}
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-4 left-4 right-24 p-4 rounded-xl bg-black/60 backdrop-blur-sm z-10">
            <p className="text-sm text-white/90">
              {lightboxImage.revisedPrompt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
