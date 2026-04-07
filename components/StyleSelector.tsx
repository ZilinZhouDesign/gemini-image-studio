'use client';

import { Sparkles } from 'lucide-react';

export type StylePreset =
  | 'cinematic'
  | 'anime'
  | 'photorealistic'
  | 'oil_painting'
  | 'watercolor'
  | 'cyberpunk'
  | 'ethereal'
  | 'commercial';

interface Style {
  id: StylePreset;
  emoji: string;
  name: string;
  nameEn: string;
}

const styles: Style[] = [
  { id: 'cinematic', emoji: '🎬', name: '电影感', nameEn: 'Cinematic' },
  { id: 'anime', emoji: '🎨', name: '动漫', nameEn: 'Anime' },
  { id: 'photorealistic', emoji: '📷', name: '写真', nameEn: 'Photorealistic' },
  { id: 'oil_painting', emoji: '🖼️', name: '油画', nameEn: 'Oil Painting' },
  { id: 'watercolor', emoji: '💧', name: '水彩', nameEn: 'Watercolor' },
  { id: 'cyberpunk', emoji: '🏙️', name: '赛博朋克', nameEn: 'Cyberpunk' },
  { id: 'ethereal', emoji: '🌿', name: '唯美梦幻', nameEn: 'Ethereal' },
  { id: 'commercial', emoji: '📰', name: '商业广告', nameEn: 'Commercial' },
];

interface StyleSelectorProps {
  selectedStyle: StylePreset | null;
  onStyleChange: (style: StylePreset | null) => void;
}

export default function StyleSelector({
  selectedStyle,
  onStyleChange,
}: StyleSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-primary" />
        <span className="text-sm text-gray-400">风格预设</span>
        {selectedStyle && (
          <span className="text-xs text-primary ml-auto">已选择</span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() =>
              onStyleChange(selectedStyle === style.id ? null : style.id)
            }
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 ${
              selectedStyle === style.id
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            style={
              selectedStyle === style.id
                ? {
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.5)',
                  }
                : {
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                  }
            }
          >
            <span className="text-base">{style.emoji}</span>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-medium">{style.name}</div>
              <div className="text-xs opacity-60">{style.nameEn}</div>
            </div>
            <div className="text-left sm:hidden">
              <div className="text-xs font-medium">{style.emoji} {style.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
