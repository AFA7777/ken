import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Sparkles, FileCode, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Message, ExportFormat, ExportOptions } from '../types';
import { generateExportContent, downloadFile } from '../utils/exportHistory';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  messages,
}) => {
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [includeReviewNotes, setIncludeReviewNotes] = useState(true);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [courseName, setCourseName] = useState('工業設計思維引導與專案覆盤');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const currentOptions: ExportOptions = {
    format,
    includeReviewNotes,
    includeTimestamp,
    studentName: studentName.trim() || undefined,
    courseName: courseName.trim() || undefined,
  };

  const preview = generateExportContent(messages, currentOptions);

  const handleDownload = () => {
    downloadFile(preview.content, preview.filename, preview.mimeType);

    // Trigger subtle confetti
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D0C5B4', '#8C8271', '#C2B6A3', '#4A4338'],
      });
    } catch {
      // ignore
    }

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1816]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E6E1D6] w-full max-w-xl rounded-3xl p-6 shadow-xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE3]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F4EFE6] text-[#6A6050] border border-[#E6DFC]-">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#22201D] font-serif-chic">
                下載問答紀錄
              </h3>
              <p className="text-xs text-[#7A7365]">
                共 {messages.length} 則問答對話，可匯出為筆記留存複習
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#928B7E] hover:text-[#22201D] hover:bg-[#F5F2EA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="py-4 space-y-5 overflow-y-auto pr-1">
          {/* Format Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#554F44] uppercase tracking-wider mb-2">
              選擇匯出檔案格式
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('markdown')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  format === 'markdown'
                    ? 'bg-[#F9F7F2] border-[#2A2724] ring-1 ring-[#2A2724]'
                    : 'bg-[#FFFFFF] border-[#E3DDD1] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="p-2 rounded-xl bg-[#ECE7DC] text-[#4F483C]">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-[#22201D]">
                      Markdown (.md)
                    </span>
                    {format === 'markdown' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2A2724]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#7A7365] mt-0.5 leading-snug">
                    支援標題、引言與粗體，適合 Notion、Obsidian
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('txt')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  format === 'txt'
                    ? 'bg-[#F9F7F2] border-[#2A2724] ring-1 ring-[#2A2724]'
                    : 'bg-[#FFFFFF] border-[#E3DDD1] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="p-2 rounded-xl bg-[#ECE7DC] text-[#4F483C]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-[#22201D]">
                      純文字 (.txt)
                    </span>
                    {format === 'txt' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2A2724]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#7A7365] mt-0.5 leading-snug">
                    簡潔純文字排版，適合任何記事本、Word、列印
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Student & Course Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#655E52] mb-1">
                學生姓名 / 暱稱 (選填)
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="例如：工設系大三 林同學"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DDD1] text-sm text-[#22201D] focus:outline-none focus:border-[#A89D8B] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#655E52] mb-1">
                課程主題 / 專案 (選填)
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="例如：手持家電 - 人因握持與 CMF 工藝規劃"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DDD1] text-sm text-[#22201D] focus:outline-none focus:border-[#A89D8B] focus:bg-white"
              />
            </div>
          </div>

          {/* Export Toggles */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#4A443B]">
              <input
                type="checkbox"
                checked={includeReviewNotes}
                onChange={(e) => setIncludeReviewNotes(e.target.checked)}
                className="rounded text-[#2A2724] focus:ring-[#2A2724] accent-[#2A2724]"
              />
              <span className="font-medium">附帶「學習心得與觀念覆盤表」（空白練習區）</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#4A443B]">
              <input
                type="checkbox"
                checked={includeTimestamp}
                onChange={(e) => setIncludeTimestamp(e.target.checked)}
                className="rounded text-[#2A2724] focus:ring-[#2A2724] accent-[#2A2724]"
              />
              <span>每則問答標註時間戳記</span>
            </label>
          </div>

          {/* Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-[#8A8274]">
                匯出預覽 (前 200 字)
              </span>
              <span className="text-[10px] text-[#A39B8E] font-mono">
                {preview.filename}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F5EE] border border-[#E7E2D5] text-[11px] font-mono text-[#524B40] max-h-24 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {preview.content.slice(0, 320)}...
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#F0ECE3] flex items-center justify-end gap-2.5 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#6A6355] hover:bg-[#F2EDE2] transition-colors cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloadSuccess}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#2A2724] hover:bg-[#3D3934] text-[#FAF8F5] transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>已成功下載！</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>下載 {format.toUpperCase()} 檔案</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
