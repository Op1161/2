import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles, Loader2, MessageSquare, Quote, Copy, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Segment {
  tone: string;
  text: string;
}

export default function TranscriptProcessor() {
  const [inputText, setInputText] = useState('');
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const processTranscript = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setSegments([]);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: [
          {
            role: "user",
            parts: [{
              text: `請分析以下逐字稿。將其根據說話者的語氣、情緒或主題切換，拆分成邏輯分段。
對於每一段，請提供一個語氣標籤（例如：[興奮]、[嚴肅]、[幽默]、[感性]、[資訊性]）以及該段的文字內容。
請以 JSON 陣列格式回傳，每個物件包含 'tone' 和 'text' 屬性。

逐字稿內容：
${inputText}`
            }]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                tone: { type: Type.STRING, description: "語氣標籤" },
                text: { type: Type.STRING, description: "該段文字內容" }
              },
              required: ["tone", "text"]
            }
          }
        }
      });

      const result = JSON.parse(response.text || '[]');
      setSegments(result);
    } catch (err) {
      console.error(err);
      setError("處理過程中發生錯誤，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  const copySegment = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          語氣分段逐字稿轉換器
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">輸入逐字稿內容</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="在此貼上您的逐字稿內容..."
              className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-slate-700"
            />
          </div>

          <button
            onClick={processTranscript}
            disabled={isLoading || !inputText.trim()}
            className={cn(
              "w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
              isLoading || !inputText.trim() 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                正在分析中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                開始語氣分段分析
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {segments.map((segment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wider">
                  {segment.tone}
                </span>
                <button
                  onClick={() => copySegment(segment.text, index)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-50 rounded-md transition-all text-slate-400 hover:text-slate-600"
                >
                  {copiedIndex === index ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-3">
                <Quote className="w-5 h-5 text-slate-200 shrink-0" />
                <p className="text-slate-700 leading-relaxed">{segment.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!isLoading && segments.length === 0 && !error && inputText && (
          <div className="text-center py-12 text-slate-400">
            <Quote className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>點擊上方按鈕開始分析您的逐字稿</p>
          </div>
        )}
      </div>
    </div>
  );
}
