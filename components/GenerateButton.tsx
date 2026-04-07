'use client';

import { Sparkles, Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  isLoading: boolean;
  resultCount?: number;
  onClick: () => void;
  disabled?: boolean;
}

export default function GenerateButton({
  isLoading,
  resultCount,
  onClick,
  disabled = false,
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
        isLoading || disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:scale-[1.02] active:scale-[0.98]'
      }`}
      style={{
        background:
          isLoading || disabled
            ? '#2A2A2A'
            : 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
        boxShadow:
          isLoading || disabled
            ? 'none'
            : '0 4px 20px rgba(139, 92, 246, 0.4)',
      }}
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          <span>生成中...</span>
        </>
      ) : resultCount !== undefined && resultCount > 0 ? (
        <>
          <Sparkles size={20} />
          <span>生成成功 ({resultCount} 张)</span>
        </>
      ) : (
        <>
          <Sparkles size={20} />
          <span>🎨 生成图片</span>
        </>
      )}
    </button>
  );
}
