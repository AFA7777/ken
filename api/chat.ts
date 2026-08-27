import type { IncomingMessage, ServerResponse } from "http";
import { GoogleGenAI } from "@google/genai";

const KEN_SYSTEM_PROMPT = `你是工業設計系的助教 Ken。你的目標是引導學生思考，而不是直接給予解答。 規則：
絕對不可以直接給出最終工業設計造型解答、現成 3D 尺寸工程圖、標準選材結論或直接幫學生做決策。
當學生發問時，請使用「蘇格拉底式提問法」，點出他們可能忽略的工業設計核心觀念（例如：人體工學與握持人因 Ergonomics、CMF 色彩材質表面處理 Color/Material/Finish、機構裝配與量產可行性 DFM/DFA、產品語意學與機能暗示 Product Semantics & Affordance、曲面連續度與光影走勢 G0/G1/G2、永續拆解與生命週期等），並反問他們下一步該怎麼驗證與評估。
語氣要像是一位溫和、有耐心且在設計工作室陪你討論評圖（Critique）的工業設計學長，適時給予鼓勵。
全程使用繁體中文回覆。`;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in server environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export default async function handler(req: any, res: any) {
  // CORS support
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    } else if (!body) {
      // If body is a raw stream in some Node/Vercel environments
      const chunks: any[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const raw = Buffer.concat(chunks).toString("utf-8");
      try {
        body = JSON.parse(raw);
      } catch {
        body = {};
      }
    }

    const { messages, stream = true } = body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "訊息格式不正確或訊息列表為空" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error:
          "未檢測到 GEMINI_API_KEY 環境變數。請在 Vercel 專案設定中的 Environment Variables 加入 GEMINI_API_KEY 並重新部署。",
      });
    }

    const ai = getGeminiClient();

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content || "" }],
    }));

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      if (res.flushHeaders) {
        res.flushHeaders();
      }

      try {
        const responseStream = await ai.models.generateContentStream({
          model: "gemini-3.7-flash",
          contents,
          config: {
            systemInstruction: KEN_SYSTEM_PROMPT,
            temperature: 0.7,
          },
        });

        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
            if (typeof res.flush === "function") {
              res.flush();
            }
          }
        }

        res.write(`data: [DONE]\n\n`);
        res.end();
      } catch (streamError: any) {
        console.error("Gemini stream error:", streamError);
        res.write(
          `data: ${JSON.stringify({
            error:
              streamError?.message ||
              "連線至 Gemini 時發生異常，請檢查 API 金鑰配額或稍後重試。",
          })}\n\n`
        );
        res.end();
      }
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction: KEN_SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Ken 助教目前正在思考中，請稍候重試。";
      return res.json({ reply: replyText });
    }
  } catch (error: any) {
    console.error("Chat API error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error:
          error?.message || "伺服器處理訊息時發生錯誤，請確認 API 金鑰或網路狀態。",
      });
    }
  }
}
