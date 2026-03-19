import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Sparkles, ChevronLeft, ChevronRight, Download, RefreshCw, Check, Info, Heart, Star, Flower } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { MAKEUP_STYLES, MakeupStyle } from './constants';

// --- Types ---
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

type AppState = 'home' | 'upload' | 'selection' | 'generation' | 'result';

export default function App() {
  const [state, setState] = useState<AppState>('home');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<MakeupStyle | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- API Key Check ---
  useEffect(() => {
    // In full-stack mode, we assume the server has the key.
    // We'll just set hasKey to true to allow the user to proceed.
    // If the key is missing, the server will return an error during generation.
    setHasKey(true);
  }, []);

  const handleOpenKeySelector = async () => {
    // This is no longer needed in the same way for the end user,
    // but we'll keep it for AI Studio environment compatibility if needed.
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
    }
  };

  // --- Image Handling ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setOriginalImage(readerEvent.target?.result as string);
        setState('selection');
      };
      reader.readAsDataURL(file);
    }
  };

  // --- AI Generation ---
  const generateMakeup = async () => {
    if (!originalImage || !selectedStyle) return;

    setState('generation');
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-makeup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalImage,
          styleName: selectedStyle.name,
          stylePrompt: selectedStyle.prompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成に失敗しました');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      setState('result');
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "予期せぬエラーが発生しました。");
      setState('selection');
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setOriginalImage(null);
    setSelectedStyle(null);
    setGeneratedImage(null);
    setState('home');
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `new-me-${selectedStyle?.id}.png`;
    link.click();
  };

  // --- Render Helpers ---
  const renderHome = () => {
    if (!hasKey) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 md:px-6 relative overflow-hidden"
        >
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-4 md:mb-6 tracking-tight text-pink-600 relative z-10">
            New Me Finder
          </h1>
          <p className="text-base md:text-lg text-pink-900/70 mb-10 md:mb-12 max-w-md leading-relaxed relative z-10 font-medium">
            AIがあなたの新しい魅力を引き出すメイクを提案します。<br/>
            自分に似合うスタイルを、今すぐ見つけましょう。
          </p>
          <div className="mb-8 p-6 bg-white/80 backdrop-blur-md border border-pink-200 rounded-2xl text-pink-800 flex flex-col items-center gap-4 max-w-sm relative z-10 shadow-lg">
            <Info className="w-8 h-8 text-pink-500" />
            <div className="text-center">
              <p className="font-bold text-lg mb-2">APIキーの設定が必要です</p>
              <p className="mb-4 opacity-90 text-sm">画像生成にはGemini APIキー（有料プロジェクト）が必要です。設定からキーを選択してください。</p>
              <button 
                onClick={handleOpenKeySelector} 
                className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-pink-600 transition-all"
              >
                キーを選択する
              </button>
            </div>
            <p className="text-xs text-pink-600/70 mt-2">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">
                課金設定についての詳細はこちら
              </a>
            </p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 md:px-6 relative overflow-hidden"
      >
        {/* Cute Background Icons */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 md:left-32 text-pink-300"
        >
          <Heart className="w-12 h-12 fill-current" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -20, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-32 right-10 md:right-32 text-pink-400"
        >
          <Star className="w-10 h-10 fill-current" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-20 md:left-40 text-pink-300"
        >
          <Flower className="w-14 h-14" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-20 md:right-40 text-pink-400"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-4 md:mb-6 tracking-tight text-pink-600 relative z-10">
          New Me Finder
        </h1>
        <p className="text-base md:text-lg text-pink-900/70 mb-10 md:mb-12 max-w-md leading-relaxed relative z-10 font-medium">
          AIがあなたの新しい魅力を引き出すメイクを提案します。<br/>
          自分に似合うスタイルを、今すぐ見つけましょう。
        </p>
        
        <button 
          onClick={() => setState('upload')}
          className="bg-pink-500 text-white w-full max-w-[240px] md:w-auto md:px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-pink-500/30 transition-all hover:bg-pink-600 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group relative z-10"
        >
          はじめる
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    );
  };

  const renderUpload = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 md:px-6"
    >
      <h2 className="font-serif text-3xl mb-8">写真をアップロード</h2>
      <label 
        htmlFor="file-upload"
        className="relative w-full max-w-sm aspect-square border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#d4a373] hover:bg-[#fdfaf7] transition-all"
      >
        <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400">
          <Camera className="w-8 h-8" />
        </div>
        <p className="text-gray-500 font-medium">カメラを起動 または ファイルを選択</p>
        <input 
          id="file-upload"
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
        />
      </label>
      <button onClick={() => setState('home')} className="mt-8 text-gray-500 underline">戻る</button>
    </motion.div>
  );

  const renderSelection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 md:px-6 py-8 md:py-12 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl">スタイルを選択</h2>
        <button onClick={() => setState('upload')} className="text-sm text-gray-500 flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> 写真を変更
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
        {MAKEUP_STYLES.map((style) => (
          <div 
            key={style.id}
            onClick={() => setSelectedStyle(style)}
            className={`style-card ${selectedStyle?.id === style.id ? 'active' : ''}`}
          >
            <img src={style.image} alt={style.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="style-card-overlay">
              <span className="text-sm font-bold">{style.name}</span>
            </div>
            {selectedStyle?.id === style.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-[#d4a373] rounded-full flex items-center justify-center text-white shadow-lg">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedStyle && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-panel p-5 md:p-6 rounded-2xl md:rounded-3xl mb-8 md:mb-12 flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left"
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{selectedStyle.name}</h3>
              <p className="text-gray-600">{selectedStyle.description}</p>
            </div>
            <button 
              onClick={generateMakeup}
              className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              このスタイルで生成
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-8">
          {error}
        </div>
      )}
    </motion.div>
  );

  const renderGeneration = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 md:px-6 text-center">
      <div className="relative w-32 h-32 mb-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-t-[#d4a373] border-gray-200 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center text-[#d4a373]">
          <Sparkles className="w-10 h-10 animate-pulse" />
        </div>
      </div>
      <h2 className="font-serif text-3xl mb-4">AIがあなたをプロデュース中...</h2>
      <p className="text-gray-500">新しいあなたに出会うまで、あと少しだけお待ちください。</p>
    </div>
  );

  const renderResult = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 md:px-6 py-8 md:py-12 max-w-5xl mx-auto"
    >
      <h2 className="font-serif text-3xl md:text-4xl text-center mb-8 md:mb-12">New Me Found!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        <div className="space-y-4">
          <p className="text-center font-medium text-gray-500 uppercase tracking-widest text-xs">Before</p>
          <div className="rounded-3xl overflow-hidden shadow-lg aspect-square bg-gray-100">
            <img src={originalImage!} alt="Original" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-center font-medium text-[#d4a373] uppercase tracking-widest text-xs">After: {selectedStyle?.name}</p>
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-square bg-gray-100 ring-4 ring-[#d4a373]/20">
            <img src={generatedImage!} alt="Generated" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <button onClick={downloadImage} className="btn-primary w-full md:w-auto flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> 画像を保存
        </button>
        <button onClick={() => setState('selection')} className="btn-secondary w-full md:w-auto flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" /> 別のスタイルを試す
        </button>
        <button onClick={reset} className="text-gray-500 underline mt-4 md:mt-0 md:ml-4">最初に戻る</button>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-screen pb-12 transition-colors duration-500 ${state === 'home' ? 'bg-pink-50' : 'bg-[#fdfaf7]'}`}>
      <header className="p-4 md:p-6 flex items-center justify-between relative z-20">
        <div className={`font-serif text-xl tracking-tight cursor-pointer transition-colors ${state === 'home' ? 'text-pink-600' : ''}`} onClick={reset}>New Me Finder</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${state === 'home' ? 'bg-pink-200 text-pink-600' : 'bg-[#d4a373]/10 text-[#d4a373]'}`}>
          <Sparkles className="w-4 h-4" />
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {state === 'home' && renderHome()}
          {state === 'upload' && renderUpload()}
          {state === 'selection' && renderSelection()}
          {state === 'generation' && renderGeneration()}
          {state === 'result' && renderResult()}
        </AnimatePresence>
      </main>

      <footer className="mt-auto px-4 md:px-6 py-8 md:py-12 text-center text-xs text-gray-400 border-t border-gray-100">
        &copy; 2026 New Me Finder. Powered by Google Gemini AI.
      </footer>
    </div>
  );
}
