import React, { useState } from 'react';
import { Download, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import { KenAvatar } from './KenAvatar';

interface HeaderProps {
  onOpenExport: () => void;
  onClearChat: () => void;
  messageCount: number;
  onOpenPrinciples: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  onClearChat,
  messageCount,
  onOpenPrinciples,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-[#E8E5DC] px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand / Avatar with @pic1 photo inside the "k" circle */}
        <div className="flex items-center gap-3">
          <KenAvatar size="md" showStatus={true} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#22201D] font-serif-chic">
                ken助教
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#EFECE4] text-[#635D52] border border-[#E0DCCE]">
                <Sparkles className="w-3 h-3 text-[#9A7B56]" />
                工業設計思維引導
              </span>
            </div>
            <p className="text-xs text-[#7A7468] hidden sm:block">
              溫和耐心的工業設計系學長 · 蘇格拉底式提問 · 陪你搞懂人因工學與 CMF 邏輯
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Principles Button */}
          <button
            onClick={onOpenPrinciples}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#655E53] hover:text-[#22201D] hover:bg-[#EFECE4] border border-transparent hover:border-[#E2DED4] transition-all cursor-pointer"
            title="了解助教引導原則"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8A7E6E]" />
            引導原則
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            disabled={messageCount === 0}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              messageCount > 0
                ? 'bg-[#2A2724] hover:bg-[#3D3935] text-[#FAF8F5] shadow-xs hover:shadow-sm active:scale-98'
                : 'bg-[#EAE6DD] text-[#A69E90] cursor-not-allowed'
            }`}
            title="下載問答紀錄"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>下載問答紀錄</span>
            {messageCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-[#46413C] text-[#EFECE6]">
                {messageCount}
              </span>
            )}
          </button>

          {/* Reset Chat Button */}
          {messageCount > 0 && (
            <div className="relative">
              {showClearConfirm ? (
                <div className="flex items-center gap-1 bg-[#F1EDE4] p-1 rounded-xl border border-[#E2DDD2] animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      onClearChat();
                      setShowClearConfirm(false);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                  >
                    確認清空
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 rounded-lg text-xs text-[#6B6458] hover:bg-[#E4DFC] cursor-pointer"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-2 rounded-xl text-[#787163] hover:text-[#22201D] hover:bg-[#EFECE4] border border-transparent hover:border-[#E2DED4] transition-all cursor-pointer"
                  title="清空對話重啟"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
