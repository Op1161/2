/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, MessageSquare, Github, Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import YtDlpGenerator from './components/YtDlpGenerator';
import TranscriptProcessor from './components/TranscriptProcessor';

type Tab = 'yt-dlp' | 'transcript';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('yt-dlp');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight hidden sm:block">Content Tools</h1>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('yt-dlp')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'yt-dlp' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden xs:inline">yt-dlp 指令</span>
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                activeTab === 'transcript' ? "bg-white text-purple-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden xs:inline">語氣分段</span>
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/yt-dlp/yt-dlp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            {activeTab === 'yt-dlp' ? "yt-dlp 指令產生器" : "語氣分段逐字稿轉換器"}
          </h2>
          <p className="text-slate-500 max-w-2xl">
            {activeTab === 'yt-dlp' 
              ? "快速產生強大的影片下載指令，支援字幕、音訊提取與自訂格式。" 
              : "利用 AI 智慧分析逐字稿，自動根據語氣與情緒進行分段，提升閱讀體驗。"}
          </p>
        </div>

        <div className="min-h-[600px]">
          {activeTab === 'yt-dlp' ? <YtDlpGenerator /> : <TranscriptProcessor />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 mt-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Info className="w-4 h-4" />
            <span>本工具僅供學術與個人研究使用，請遵守相關平台規範。</span>
          </div>
          <div className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Content Tools. Powered by Gemini AI.
          </div>
        </div>
      </footer>
    </div>
  );
}

