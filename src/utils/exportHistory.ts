import { Message, ExportOptions } from '../types';

export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export function generateExportContent(
  messages: Message[],
  options: ExportOptions
): { content: string; filename: string; mimeType: string } {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  const studentHeader = options.studentName ? `學生姓名：${options.studentName}` : '學生姓名：自主學習者';
  const courseHeader = options.courseName ? `課程主題：${options.courseName}` : '課程主題：工業設計思維引導與專案覆盤';

  if (options.format === 'markdown') {
    let md = `# 📖 ken助教 · 工業設計思維引導與專案覆盤筆記\n\n`;
    md += `> 「不直接給出造型解答，而是引導你一步步看清人因工學、CMF材料工藝與量產邏輯。」 —— Ken 助教\n\n`;
    md += `**匯出時間**：${formatDateTime(now.getTime())}\n`;
    md += `**${studentHeader}**\n`;
    md += `**${courseHeader}**\n`;
    md += `**對話總輪數**：${messages.length} 則訊息\n\n`;
    md += `---\n\n`;
    md += `## 💬 對話與思維引導歷程\n\n`;

    messages.forEach((msg, index) => {
      const isUser = msg.role === 'user';
      const speaker = isUser ? '🧑‍🎓 學生提問 / 思考推論' : '👨‍🎨 Ken 助教 (引導回應)';
      const timeTag = options.includeTimestamp ? ` *(${formatDateTime(msg.timestamp)})*` : '';

      md += `### ${index + 1}. ${speaker}${timeTag}\n\n`;
      md += `${msg.content.trim()}\n\n`;
    });

    if (options.includeReviewNotes) {
      md += `---\n\n`;
      md += `## 📝 本次工業設計覆盤與驗證清單 (自主填寫)\n\n`;
      md += `- **今日釐清的工設核心觀念**（例如：人因握持重心、CMF表面處理、DFM拔模開模、G2曲面連續）：\n  - \n\n`;
      md += `- **原本卡住 / 忽略的工程與美學關鍵**（例如：分模線位置、公差過渡縫隙、機能暗示不足）：\n  - \n\n`;
      md += `- **下一步草模驗證 / 3D CAD 調整項目**：\n  - \n\n`;
      md += `*整理自「ken助教」AI 工業設計思維引導平台*\n`;
    }

    return {
      content: md,
      filename: `ken助教_工業設計問答紀錄_${dateStr}.md`,
      mimeType: 'text/markdown;charset=utf-8',
    };
  } else {
    // Plain Text (.txt)
    let txt = `=======================================================\n`;
    txt += `  ken助教 · 工業設計思維引導與專案覆盤筆記\n`;
    txt += `  引導思考 · 蘇格拉底式學習 · 不直接給答案\n`;
    txt += `=======================================================\n\n`;
    txt += `匯出時間：${formatDateTime(now.getTime())}\n`;
    txt += `${studentHeader}\n`;
    txt += `${courseHeader}\n`;
    txt += `訊息總數：${messages.length} 則\n\n`;
    txt += `-------------------------------------------------------\n\n`;

    messages.forEach((msg, index) => {
      const isUser = msg.role === 'user';
      const speaker = isUser ? '【學生】' : '【Ken 助教】';
      const timeTag = options.includeTimestamp ? ` [${formatDateTime(msg.timestamp)}]` : '';

      txt += `[#${index + 1}] ${speaker}${timeTag}\n`;
      txt += `${msg.content.trim()}\n\n`;
      txt += `-------------------------------------------------------\n\n`;
    });

    if (options.includeReviewNotes) {
      txt += `\n【工業設計覆盤與自我檢核】\n`;
      txt += `1. 今日搞懂的工設核心概念：\n`;
      txt += `2. 原本容易忽略的人因/CMF/量產細節：\n`;
      txt += `3. 下一步預計製作的實體草模與 3D 修正：\n\n`;
    }

    txt += `\n* 檔案產生自 ken助教 平台 *\n`;

    return {
      content: txt,
      filename: `ken助教_工業設計問答紀錄_${dateStr}.txt`,
      mimeType: 'text/plain;charset=utf-8',
    };
  }
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
