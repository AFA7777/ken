/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Message, StarterQuestion } from './types';
import { Header } from './components/Header';
import { ChatMessageItem } from './components/ChatMessageItem';
import { ChatInput } from './components/ChatInput';
import { StarterHero } from './components/StarterHero';
import { ExportModal } from './components/ExportModal';
import { PrinciplesModal } from './components/PrinciplesModal';
import { KenAvatar } from './components/KenAvatar';

const STORAGE_KEY = 'ken_ta_id_messages_v1';

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to read messages from localStorage', e);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPrinciplesOpen, setIsPrinciplesOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save messages to localStorage', e);
    }
  }, [messages]);

  // Auto scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    chatBottomRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isLoading]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    const userMsg: Message = {
      id: userMessageId,
      role: 'user',
      content: userText.trim(),
      timestamp: Date.now(),
    };

    const newMessagesList = [...messages, userMsg];

    // Placeholder for assistant
    const assistantPlaceholder: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    setMessages([...newMessagesList, assistantPlaceholder]);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessagesList.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `伺服器回應錯誤 (${response.status})`);
      }

      const contentType = response.headers.get('content-type') || '';
      let accumulatedReply = '';

      if (contentType.includes('application/json')) {
        const jsonData = await response.json();
        accumulatedReply = jsonData.reply || jsonData.text || '';
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content:
                    accumulatedReply ||
                    'Ken 助教已收到你的提問，請再補充更多工設細節或目前的草模/3D構想，我們一起來推導！',
                  isStreaming: false,
                }
              : msg
          )
        );
        return;
      }

      if (!response.body) {
        throw new Error('無法讀取伺服器串流回應');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processLine = (line: string) => {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) return;

        const dataPayload = trimmed.replace(/^data:\s*/, '');
        if (dataPayload === '[DONE]') return;

        try {
          const parsed = JSON.parse(dataPayload);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.text) {
            accumulatedReply += parsed.text;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: accumulatedReply, isStreaming: true }
                  : msg
              )
            );
          }
        } catch (jsonErr: any) {
          if (jsonErr.message && !jsonErr.message.includes('JSON')) {
            throw jsonErr;
          }
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';

        for (const line of lines) {
          processLine(line);
        }
      }

      // Process any remaining text in buffer
      if (buffer.trim()) {
        processLine(buffer);
      }

      // Stream finalized
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content:
                  accumulatedReply ||
                  'Ken 助教已收到你的提問，請再補充更多工設細節或目前的草模/3D構想，我們一起來推導！',
                isStreaming: false,
              }
            : msg
        )
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      } else {
        console.error('Chat error:', err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: `抱歉，助教學長在連線時遇到了一點小狀況：${err.message || '請確認網路連線'}。你可以點擊下方重新發問！`,
                  isStreaming: false,
                  isError: true,
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleRetryLast = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      // Remove last error assistant message
      const filtered = messages.filter((m) => !m.isError);
      setMessages(filtered);
      handleSendMessage(lastUserMessage.content);
    }
  };

  const handleSelectStarterQuestion = (question: StarterQuestion) => {
    handleSendMessage(question.prompt);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#201E1C]">
      {/* Header */}
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        onClearChat={handleClearChat}
        messageCount={messages.length}
        onOpenPrinciples={() => setIsPrinciplesOpen(true)}
      />

      {/* Main Chat Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-4 pb-2 flex flex-col justify-between">
        {messages.length === 0 ? (
          <StarterHero onSelectQuestion={handleSelectStarterQuestion} />
        ) : (
          <div className="space-y-1 pb-4">
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                onRetry={msg.isError ? handleRetryLast : undefined}
              />
            ))}

            {/* Typing status indicator when initiating response */}
            {isLoading &&
              messages[messages.length - 1]?.role === 'assistant' &&
              !messages[messages.length - 1]?.content && (
                <div className="flex items-center gap-2.5 text-xs text-[#8A8274] my-4 pl-1">
                  <KenAvatar size="xs" />
                  <span className="animate-pulse">
                    Ken 助教正在梳理人因與工藝原則、準備反思提問...
                  </span>
                </div>
              )}

            <div ref={chatBottomRef} className="h-4" />
          </div>
        )}
      </main>

      {/* Floating Bottom Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onStop={handleStop}
      />

      {/* Export Dialog */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        messages={messages}
      />

      {/* Principles Dialog */}
      <PrinciplesModal
        isOpen={isPrinciplesOpen}
        onClose={() => setIsPrinciplesOpen(false)}
      />
    </div>
  );
}
