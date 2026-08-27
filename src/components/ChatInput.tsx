import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, CornerDownLeft, StopCircle } from 'lucide-react';
import { QUICK_HINT_PROMPTS } from '../data/designPrompts';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onStop?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStop,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickPromptClick = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <div className="sticky bottom-0 z-20 bg-gradient-to-t from-[#F8F7F4] via-[#F8F7F4]/95 to-transparent pt-3 pb-4 sm:pb-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Quick Hint Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="shrink-0 text-[11px] text-[#8C8576] font-medium flex items-center gap-1 pl-1">
            <Sparkles className="w-3 h-3 text-[#B09778]" />
            快速引導：
          </span>
          {QUICK_HINT_PROMPTS.map((hint, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPromptClick(hint)}
              disabled={isLoading}
              className="shrink-0 px-2.5 py-1 rounded-full bg-[#FFFFFF] hover:bg-[#F2ECE0] border border-[#E3DDD1] hover:border-[#D0C8B8] text-[#554F44] hover:text-[#23201C] transition-all cursor-pointer shadow-2xs text-[11px] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {hint}
            </button>
          ))}
        </div>

        {/* Input Card */}
        <form
          onSubmit={handleSubmit}
          className="relative bg-[#FFFFFF] border border-[#E2DDD2] focus-within:border-[#B5A893] focus-within:ring-2 focus-within:ring-[#EAE3D5] rounded-2xl p-2 sm:p-2.5 shadow-sm transition-all duration-200"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="請輸入你的工業設計問題、人因/CMF困惑或目前草模/3D想法...（Enter 送出，Shift+Enter 換行）"
              rows={1}
              disabled={isLoading}
              className="w-full resize-none bg-transparent px-3 py-2 text-sm sm:text-base text-[#201E1C] placeholder-[#9E9789] focus:outline-none max-h-44 min-h-[44px]"
            />

            <div className="flex items-center gap-1 shrink-0 pb-1 pr-1">
              {isLoading && onStop ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="p-2 rounded-xl bg-[#EBE5DA] hover:bg-[#DDD6C8] text-[#5C5548] transition-colors cursor-pointer"
                  title="停止生成"
                >
                  <StopCircle className="w-4 h-4 text-red-600" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    input.trim() && !isLoading
                      ? 'bg-[#2A2724] hover:bg-[#403B36] text-[#FAF8F5] shadow-xs active:scale-95'
                      : 'bg-[#F0ECE4] text-[#B5AEA1] cursor-not-allowed'
                  }`}
                  title="送出提問"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="px-3 pb-1 flex items-center justify-between text-[11px] text-[#A69F91]">
            <span>💡 Ken 助教會引導你思考，不直接給出最終答案</span>
            <span className="hidden sm:inline">支援 Markdown 語法</span>
          </div>
        </form>
      </div>
    </div>
  );
};
