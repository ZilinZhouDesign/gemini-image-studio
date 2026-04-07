'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function PromptInput({
  value,
  onChange,
  maxLength = 1000,
}: PromptInputProps) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  return (
    <div className="relative">
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
        <Sparkles size={18} className="text-primary" />
        <span className="text-sm text-gray-400 hidden sm:inline">Prompt</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            onChange(e.target.value);
          }
        }}
        placeholder="描述你想要的图片... 例如：一只穿着汉服的猫站在故宫屋顶上，电影感，8K画质"
        className="w-full h-40 p-4 pl-12 pt-10 rounded-xl resize-none focus:outline-none focus:ring-2 transition-all text-white placeholder-gray-500"
        style={{
          backgroundColor: '#1A1A1A',
          border: '1px solid #2A2A2A',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#8B5CF6';
          e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.2)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#2A2A2A';
          e.target.style.boxShadow = 'none';
        }}
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <span
          className={`text-xs ${charCount > maxLength * 0.9 ? 'text-yellow-500' : 'text-gray-500'}`}
        >
          {charCount}/{maxLength}
        </span>
      </div>
    </div>
  );
}
