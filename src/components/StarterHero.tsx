import React from 'react';
import { Sparkles, MessageSquare, ArrowRight, Lightbulb, Compass, Palette } from 'lucide-react';
import { STARTER_QUESTIONS } from '../data/designPrompts';
import { StarterQuestion } from '../types';
import { KenAvatar } from './KenAvatar';

interface StarterHeroProps {
  onSelectQuestion: (question: StarterQuestion) => void;
}

export const StarterHero: React.FC<StarterHeroProps> = ({ onSelectQuestion }) => {
  return (
    <div className="py-6 sm:py-10 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Intro Banner */}
      <div className="bg-[#FFFFFF] border border-[#E8E4DA] rounded-3xl p-6 sm:p-8 paper-shadow text-center relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#F4EFE6] rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#EDE7DA] rounded-full blur-2xl pointer-events-none" />

        {/* Ken Avatar in the "k" circle */}
        <div className="flex justify-center mb-4">
          <KenAvatar size="lg" showStatus={true} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#22201D] font-serif-chic mb-3">
          哈囉！我是你的工業設計學長 Ken 助教
        </h2>

        <p className="text-sm sm:text-base text-[#615B50] max-w-xl mx-auto leading-relaxed mb-6">
          做產品設計最忌諱天馬行空卻忽略人因與量產可行性。我會使用「蘇格拉底式提問法」陪你剖析設計背後的工程與美學原理，
          <strong className="text-[#2B2824] font-medium"> 不直接幫你給現成 3D 尺寸或標準答案</strong>，而是點出人體工學、CMF 材料工藝、曲面品質與機構盲點，陪你做出能真正落地的優質產品！
        </p>

        {/* 3 Core Rules chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-[#F9F7F2] border border-[#ECE7DC] flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#EFE9DD] text-[#7A6E5C] mt-0.5">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#2C2925]">啟發思考，不給現成方案</p>
              <p className="text-[11px] text-[#787163] mt-0.5 leading-snug">
                點出你忽略的人因工學與材質細節，引導自主評估。
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F9F7F2] border border-[#ECE7DC] flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#EFE9DD] text-[#7A6E5C] mt-0.5">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#2C2925]">蘇格拉底反問式引導</p>
              <p className="text-[11px] text-[#787163] mt-0.5 leading-snug">
                透過層層提問，理清造型語意、分模線與機構關係。
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F9F7F2] border border-[#ECE7DC] flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#EFE9DD] text-[#7A6E5C] mt-0.5">
              <Palette className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#2C2925]">溫和耐心，專業陪跑</p>
              <p className="text-[11px] text-[#787163] mt-0.5 leading-snug">
                草模與 CAD 迭代是必經過程，學長隨時陪你討論評圖。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Starter Questions Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7D7567] flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            熱門工業設計課題 · 點擊向學長請教
          </h3>
          <span className="text-xs text-[#9B9384]">六大核心工設與量產主題</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STARTER_QUESTIONS.map((q) => (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(q)}
              className="text-left p-4 rounded-2xl bg-[#FFFFFF] border border-[#E7E2D6] hover:border-[#CFC6B4] hover:bg-[#FCFAF7] transition-all duration-200 group cursor-pointer paper-shadow hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F2EDE3] text-[#706859] border border-[#E2DBD0]">
                    {q.badge}
                  </span>
                  <span className="text-[11px] text-[#A29A8C]">{q.category}</span>
                </div>
                <h4 className="text-sm font-medium text-[#24211E] group-hover:text-[#0F0E0D] leading-snug">
                  {q.title}
                </h4>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#F2ECE1] flex items-center justify-between text-xs text-[#8A8272] group-hover:text-[#4A4338]">
                <span className="text-[11px] line-clamp-1 opacity-80">{q.prompt}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
