'use client';

import { Maximize2 } from 'lucide-react';

export type AspectRatio = '1:1' | '16:9' | '9:16';

interface Size {
  id: AspectRatio;
  label: string;
  sublabel: string;
}

const sizes: Size[] = [
  { id: '1:1', label: '1:1', sublabel: '1024×1024' },
  { id: '16:9', label: '16:9', sublabel: '1792×1024' },
  { id: '9:16', label: '9:16', sublabel: '手机壁纸' },
];

interface SizeSelectorProps {
  selectedSize: AspectRatio;
  onSizeChange: (size: AspectRatio) => void;
}

export default function SizeSelector({
  selectedSize,
  onSizeChange,
}: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Maximize2 size={16} className="text-accent" />
        <span className="text-sm text-gray-400">尺寸比例</span>
      </div>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSizeChange(size.id)}
            className={`flex-1 flex flex-col items-center gap-1 px-3 py-3 rounded-xl transition-all duration-200 ${
              selectedSize === size.id
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            style={
              selectedSize === size.id
                ? {
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
                    border: '2px solid #06B6D4',
                  }
                : {
                    backgroundColor: '#1A1A1A',
                    border: '2px solid #2A2A2A',
                  }
            }
          >
            <div
              className="w-8 h-8 flex items-center justify-center rounded"
              style={{
                backgroundColor:
                  selectedSize === size.id
                    ? 'rgba(6, 182, 212, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
              }}
            >
              {size.id === '1:1' && (
                <div className="w-4 h-4 border-2 border-current rounded-sm" />
              )}
              {size.id === '16:9' && (
                <div className="w-5 h-3 border-2 border-current rounded-sm" />
              )}
              {size.id === '9:16' && (
                <div className="w-3 h-5 border-2 border-current rounded-sm" />
              )}
            </div>
            <div className="text-sm font-medium">{size.label}</div>
            <div className="text-xs opacity-60 hidden sm:block">{size.sublabel}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
