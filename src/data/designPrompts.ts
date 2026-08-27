import { StarterQuestion } from '../types';

export const STARTER_QUESTIONS: StarterQuestion[] = [
  {
    id: 'starter-1',
    category: '人因與握持',
    badge: 'Ergonomics',
    title: '手持產品長時間使用手感不佳，該如何評估握持工學？',
    prompt: 'Ken 助教好！我正在設計一款手持電動工具/吹風機，但評圖時老師提到握持重心不穩且拇指操作區域容易疲勞。請問學長在進行握持人因工程（Anthropometry）分析與實體草模驗證（Foam Model）時，核心的檢驗步驟是什麼？',
  },
  {
    id: 'starter-2',
    category: 'CMF 材料工藝',
    badge: 'Materials & Finish',
    title: '金屬與塑料拼接時，如何設定合理的收邊與表面質感？',
    prompt: '學長好！我的產品外殼採用鋁合金陽極氧化搭配 ABS+PC 塑料件，在渲染圖看起來很精緻，但在實際製造上要考慮到公差、咬花（Texture）與表面反光。請問在 CMF 規劃與件與件的過渡縫隙（Reveal Gap）上，有哪些核心原則？',
  },
  {
    id: 'starter-3',
    category: '產品語意學',
    badge: 'Product Semantics',
    title: '如何讓使用者不看說明書，就能直覺感知操作方式？',
    prompt: '助教好！我想讓產品外觀保持極簡無多餘按鍵，但受試者測試時卻不知道開關該按哪裡、方向該如何旋轉。在工業設計的「機能可尋性（Affordance）」與「產品語意（Semantics）」上，我該如何透過造型暗示使用方式？',
  },
  {
    id: 'starter-4',
    category: '曲面品質',
    badge: 'Surface G2',
    title: '曲面斑馬線（Zebra Striping）不流暢，如何提升光影品質？',
    prompt: 'Ken 學長，我在 Rhino / Alias 建模時，倒角和主要分件面看起來有生硬的折角感，光影斑馬線測試出現斷點（只有 G1 相切）。請問在追求高等級 G2 曲面曲率連續與流暢漸變時，該如何建立正確的空間基準曲線？',
  },
  {
    id: 'starter-5',
    category: '量產開模可行性',
    badge: 'DFM & Tooling',
    title: '分模線（Parting Line）與拔模角該如何巧妙融入造型？',
    prompt: '助教，工程師反映我的塑膠外殼造型有嚴重的倒勾（Undercut），且拔模角度（Draft Angle）不夠會卡模。身為工業設計師，我該如何把必要的分模線（PL）轉化為外觀特徵線，兼顧美感與量產性？',
  },
  {
    id: 'starter-6',
    category: '機構與互動',
    badge: 'Mechanism & UX',
    title: '旋鈕與轉軸的阻尼手感與機械回饋該如何定義？',
    prompt: '學長好！我在設計一款音響/家電的實體控制旋鈕，希望呈現高級沉穩的轉動阻尼感與清晰的段落定位（Tactile Click）。在工業設計規格書（Spec）中，該如何量化並與機構工程師溝通這種物理互動體驗？',
  },
];

export const QUICK_HINT_PROMPTS = [
  '💡 請給我一個思考小提示，我卡在握持人體工學的重心分配上了',
  '🔍 幫我檢驗目前的外殼分件是否符合塑膠射出成型（DFM）原則',
  '🎨 請問在 CMF（色彩/材質/表面處理）配置上該如何凸顯產品層次？',
  '📐 請問如何透過造型特徵（Form Factor）引導使用者直覺操作？',
];
