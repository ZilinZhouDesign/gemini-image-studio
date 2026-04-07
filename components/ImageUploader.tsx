'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
  onImageChange: (base64: string | null) => void;
  imagePreview: string | null;
}

export default function ImageUploader({
  onImageChange,
  imagePreview,
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (file: File): Promise<string> => {
    setIsCompressing(true);
    setProgress(0);

    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      onProgress: (p: number) => setProgress(Math.round(p)),
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
      setIsCompressing(false);
      setProgress(100);
      return base64;
    } catch (error) {
      setIsCompressing(false);
      throw error;
    }
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }

      try {
        const base64 = await compressImage(file);
        onImageChange(base64);
      } catch (error) {
        console.error('Image compression error:', error);
        alert('图片处理失败，请重试');
      }
    },
    [onImageChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (imagePreview) {
    return (
      <div className="relative rounded-xl overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
        <img
          src={imagePreview}
          alt="参考图预览"
          className="w-full h-48 object-cover rounded-xl"
        />
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
        >
          <X size={16} className="text-white" />
        </button>
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 text-xs text-white flex items-center gap-1">
          <ImageIcon size={12} />
          参考图
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`drop-zone relative h-48 rounded-xl cursor-pointer transition-all duration-200 ${
        isDragOver ? 'drag-over' : ''
      }`}
      style={{
        backgroundColor: '#1A1A1A',
        border: `2px dashed ${isDragOver ? '#8B5CF6' : '#2A2A2A'}`,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {isCompressing ? (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-sm text-gray-300">压缩中...</p>
            <p className="text-xs text-gray-500">{progress}%</p>
          </div>
          <div className="w-32 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#2A2A2A' }}>
            <div
              className="h-full transition-all duration-200"
              style={{ width: `${progress}%`, backgroundColor: '#8B5CF6' }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <div
            className="p-4 rounded-full"
            style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
          >
            <Upload size={24} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300">
              拖拽图片到这里，或<span className="text-primary">点击上传</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">支持 JPG、PNG、WebP，最大 2MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
