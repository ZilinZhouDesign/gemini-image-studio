'use client';

import { Wand2, Image as ImageIcon } from 'lucide-react';

interface ModeSelectorProps {
  mode: 'text-to-image' | 'image-to-image';
  onModeChange: (mode: 'text-to-image' | 'image-to-image') => void;
}

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: '#1A1A1A' }}>
      <button
        onClick={() => onModeChange('text-to-image')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
          mode === 'text-to-image'
            ? 'text-white shadow-lg'
            : 'text-gray-400 hover:text-gray-200'
        }`}
        style={
          mode === 'text-to-image'
            ? { background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)' }
            : {}
        }
      >
        <Wand2 size={20} />
        <span className="font-medium text-sm sm:text-base">文生图</span>
      </button>

      <button
        onClick={() => onModeChange('image-to-image')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
          mode === 'image-to-image'
            ? 'text-white shadow-lg'
            : 'text-gray-400 hover:text-gray-200'
        }`}
        style={
          mode === 'image-to-image'
            ? { background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)' }
            : {}
        }
      >
        <ImageIcon size={20} />
        <span className="font-medium text-sm sm:text-base">图生图</span>
      </button>
    </div>
  );
}
