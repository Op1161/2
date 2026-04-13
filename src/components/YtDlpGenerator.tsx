import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Youtube, Music, Video, Subtitles, FileText } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function YtDlpGenerator() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('best');
  const [audioOnly, setAudioOnly] = useState(false);
  const [audioFormat, setAudioFormat] = useState('mp3');
  const [embedSubs, setEmbedSubs] = useState(true);
  const [writeAutoSubs, setWriteAutoSubs] = useState(true);
  const [subLang, setSubLang] = useState('zh-Hant,en');
  const [outputTemplate, setOutputTemplate] = useState('%(title)s.%(ext)s');
  const [command, setCommand] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cmd = 'yt-dlp ';
    
    if (audioOnly) {
      cmd += `-x --audio-format ${audioFormat} `;
    } else if (format === 'best') {
      cmd += '-f "bv+ba/b" ';
    }

    if (embedSubs) cmd += '--embed-subs ';
    if (writeAutoSubs) cmd += '--write-auto-subs ';
    if (subLang) cmd += `--sub-langs "${subLang}" `;
    
    cmd += `-o "${outputTemplate}" `;
    cmd += `"${url || 'VIDEO_URL'}"`;

    setCommand(cmd);
  }, [url, format, audioOnly, audioFormat, embedSubs, writeAutoSubs, subLang, outputTemplate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-blue-600" />
          yt-dlp 指令產生器
        </h2>

        <div className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">影片網址 (URL)</label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Video className="w-4 h-4" /> 下載格式
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAudioOnly(false)}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all",
                    !audioOnly ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  影片 + 音訊
                </button>
                <button
                  onClick={() => setAudioOnly(true)}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all",
                    audioOnly ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  僅音訊
                </button>
              </div>
            </div>

            {/* Audio Format (if audio only) */}
            {audioOnly && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Music className="w-4 h-4" /> 音訊格式
                </label>
                <select
                  value={audioFormat}
                  onChange={(e) => setAudioFormat(e.target.value)}
                  className="w-full py-2 px-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mp3">MP3</option>
                  <option value="m4a">M4A</option>
                  <option value="wav">WAV</option>
                  <option value="flac">FLAC</option>
                  <option value="opus">Opus</option>
                </select>
              </div>
            )}
          </div>

          {/* Subtitle Options */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Subtitles className="w-4 h-4" /> 字幕選項
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={embedSubs}
                  onChange={(e) => setEmbedSubs(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">內嵌字幕 (Embed)</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={writeAutoSubs}
                  onChange={(e) => setWriteAutoSubs(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">自動產生字幕 (Auto-subs)</span>
              </label>
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">語言代碼 (逗號分隔)</label>
              <input
                type="text"
                value={subLang}
                onChange={(e) => setSubLang(e.target.value)}
                placeholder="zh-Hant,en"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Output Template */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4" /> 檔名格式
            </label>
            <input
              type="text"
              value={outputTemplate}
              onChange={(e) => setOutputTemplate(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              常用變數: %(title)s (標題), %(ext)s (副檔名), %(uploader)s (上傳者)
            </p>
          </div>
        </div>
      </div>

      {/* Command Output */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-xl overflow-hidden relative group">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Generated Command</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs font-medium transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Command</span>
              </>
            )}
          </button>
        </div>
        <div className="font-mono text-sm text-blue-400 break-all bg-slate-950/50 p-4 rounded-lg border border-slate-800">
          <span className="text-slate-500 mr-2">$</span>
          {command}
        </div>
      </div>
    </div>
  );
}
