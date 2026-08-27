import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Volume2, VolumeX, Sparkles, User, RefreshCw } from 'lucide-react';
import { Message } from '../types';
import { formatDateTime } from '../utils/exportHistory';
import { KenAvatar } from './KenAvatar';

interface ChatMessageItemProps {
  message: Message;
  onRetry?: () => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner speech
    const cleanText = message.content
      .replace(/[*#`_~>-]/g, '')
      .replace(/\n+/g, '，');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-TW';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 my-4 sm:my-6 group">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#8C8476] px-1">
            <span>你</span>
            <span>·</span>
            <span>{formatDateTime(message.timestamp).split(' ')[1]}</span>
          </div>
          <div className="px-4.5 py-3.5 rounded-2xl rounded-tr-sm bg-[#ECE7DC] text-[#22201D] border border-[#DDD7CB] text-sm sm:text-[15px] leading-relaxed shadow-2xs">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#E5DFD2] border border-[#D5CEBF] flex items-center justify-center text-[#6B6354] shrink-0 mt-6 shadow-2xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Ken TA Message
  return (
    <div className="flex justify-start gap-3 my-4 sm:my-6 group">
      {/* Ken Avatar */}
      <div className="mt-1">
        <KenAvatar size="sm" />
      </div>

      <div className="flex flex-col items-start max-w-[92%] sm:max-w-[85%]">
        {/* Author header */}
        <div className="flex items-center gap-2 mb-1.5 px-1">
          <span className="text-xs font-semibold text-[#2D2A26] font-serif-chic">
            Ken 助教
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#EFECE4] text-[#7A7365] border border-[#E3DFD4]">
            學長引導
          </span>
          <span className="text-[11px] text-[#9A9385]">
            {formatDateTime(message.timestamp).split(' ')[1]}
          </span>
        </div>

        {/* Card Body */}
        <div className="w-full bg-[#FFFFFF] border border-[#E7E3D8] rounded-2xl rounded-tl-sm p-4 sm:p-5 text-[#22201D] shadow-2xs relative paper-shadow">
          {message.isError ? (
            <div className="space-y-2 text-red-700">
              <p className="text-sm">{message.content}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#7C6F5E] hover:text-[#2D2A26] underline cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  重新嘗試提問
                </button>
              )}
            </div>
          ) : (
            <div className="markdown-body prose prose-stone max-w-none text-sm sm:text-[15px] leading-relaxed space-y-3">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2.5 last:mb-0 text-[#25221F] leading-relaxed">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-[#181614] bg-[#F7F4EB] px-1 py-0.2 rounded">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 text-[#332F2B]">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-[#332F2B]">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-[#C8BEAD] pl-3 py-1 my-2 bg-[#FBF9F5] text-[#554F45] italic rounded-r-md">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="px-1.5 py-0.5 rounded bg-[#F4EFE6] text-[#4A4338] text-xs font-mono border border-[#E5DFD4]">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <div className="my-3 rounded-xl bg-[#282623] text-[#EDE8DF] p-3 text-xs sm:text-sm font-mono overflow-x-auto border border-[#3E3A35]">
                        <pre>{children}</pre>
                      </div>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>

              {message.isStreaming && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-[#8C8271] animate-pulse align-middle" />
              )}
            </div>
          )}

          {/* Action Bar */}
          {!message.isStreaming && !message.isError && (
            <div className="mt-3.5 pt-2.5 border-t border-[#F2EEE6] flex items-center justify-between text-xs text-[#8A8375]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#9E978A]">
                <Sparkles className="w-3 h-3 text-[#A88E6B]" />
                <span>蘇格拉底啟發式引導</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSpeech}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isSpeaking ? 'text-amber-700 bg-amber-50' : 'text-[#8A8375] hover:text-[#22201D] hover:bg-[#F5F2EA]'
                  }`}
                  title={isSpeaking ? '停止朗讀' : '語音朗讀'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg text-[#8A8375] hover:text-[#22201D] hover:bg-[#F5F2EA] transition-colors cursor-pointer"
                  title="複製回應文字"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
