import React from 'react';
import { X, BookOpen, Compass, HeartHandshake, ShieldAlert } from 'lucide-react';

interface PrinciplesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrinciplesModal: React.FC<PrinciplesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1816]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E6E1D6] w-full max-w-lg rounded-3xl p-6 shadow-xl relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F0ECE3]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#F3EEE5] text-[#5C5343]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#22201D] font-serif-chic">
                Ken 助教的引導理念與原則
              </h3>
              <p className="text-xs text-[#7A7365]">
                依據系統指令設定的蘇格拉底式工業設計教學法
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

        <div className="py-4 space-y-4 text-xs sm:text-sm text-[#4E473D] leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#EBE5DA] space-y-1.5">
            <div className="flex items-center gap-2 text-[#24211D] font-semibold">
              <ShieldAlert className="w-4 h-4 text-[#A87438]" />
              <span>原則一：絕不直接給出最終造型答案或 3D 尺寸</span>
            </div>
            <p className="text-xs text-[#6F675A] pl-6">
              助教學長不會直接幫你決定外觀特徵或丟出現成尺寸數據，目的是引導你理解設計背後的人因依據與工程取捨，培養獨立的工設思維與決策能力。
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#EBE5DA] space-y-1.5">
            <div className="flex items-center gap-2 text-[#24211D] font-semibold">
              <Compass className="w-4 h-4 text-[#5A7E64]" />
              <span>原則二：蘇格拉底反問式引導</span>
            </div>
            <p className="text-xs text-[#6F675A] pl-6">
              當你卡關時，學長會點出你可能忽略的工業設計核心觀念（如人因工程、CMF 材料表面工藝、分模拔模量產性 DFM、產品語意與 G2 曲面光影），並反問你下一步該如何驗證與評估。
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#EBE5DA] space-y-1.5">
            <div className="flex items-center gap-2 text-[#24211D] font-semibold">
              <HeartHandshake className="w-4 h-4 text-[#8C6D58]" />
              <span>原則三：溫和耐心的學長語氣</span>
            </div>
            <p className="text-xs text-[#6F675A] pl-6">
              全程使用繁體中文，像是一位在設計工作室桌邊陪你討論草模、檢查 3D 與評圖（Critique）的親切學長，適時給予肯定與啟發！
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#F0ECE3] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#2A2724] hover:bg-[#3D3934] text-[#FAF8F5] transition-colors cursor-pointer"
          >
            知道了，開始討論
          </button>
        </div>
      </div>
    </div>
  );
};
