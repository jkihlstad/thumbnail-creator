"use client";

import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import {
  Download,
  Loader2,
  AlertCircle,
  History,
  Sparkles,
  ImageIcon,
  LayoutTemplate,
  Settings,
  Wand2,
  Share2,
  Zap,
  Menu,
  X
} from "lucide-react";

const STYLE_PRESETS = [
  { id: 'cinematic', name: 'Cinematic', description: 'High contrast, dramatic lighting' },
  { id: '3d-render', name: '3D Render', description: 'Octane render, isometric view' },
  { id: 'anime', name: 'Anime', description: 'Vibrant colors, sharp lines' },
  { id: 'minimalist', name: 'Minimalist', description: 'Clean, negative space, vector' },
  { id: 'clickbait', name: 'YouTube High CTR', description: 'Expressive faces, big text, arrows' },
];

const ASPECT_RATIOS = [
  { id: '16:9', label: 'YouTube (16:9)', width: 1920, height: 1080 },
  { id: '9:16', label: 'TikTok/Reels (9:16)', width: 1080, height: 1920 },
  { id: '1:1', label: 'Square (1:1)', width: 1080, height: 1080 },
];

export default function AppPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0]);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useUser();
  const generateThumbnail = useAction(api.generateThumbnail.generateThumbnail);
  const thumbnails = useQuery(
    api.thumbnails.getUserThumbnails,
    user?.id ? { userId: user.id } : "skip"
  );

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    if (!user?.id) {
      setError("You must be signed in to generate thumbnails");
      return;
    }

    setIsLoading(true);
    setError("");
    setImageUrl(""); // Clear previous image

    try {
      // Include style in prompt for better results
      const enhancedPrompt = `${prompt}, ${selectedStyle.description}, ${selectedRatio.label} aspect ratio`;
      const result = await generateThumbnail({ prompt: enhancedPrompt, userId: user.id });
      if (result) {
        setImageUrl(result);
      } else {
        setError("Failed to generate thumbnail. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while generating the thumbnail"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `thumbnail-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5" fill="currentColor" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                ThumbGen<span className="text-indigo-500">.ai</span>
              </span>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                <History className="w-4 h-4" />
                History
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-4">
            <button
              onClick={() => {
                setShowHistory(!showHistory);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full p-2 rounded-lg text-slate-400"
            >
              <History className="w-5 h-5" />
              History
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-64px)] overflow-hidden flex flex-col md:flex-row gap-6">
        {/* Left Sidebar: Controls */}
        <div className="w-full md:w-96 flex-shrink-0 flex flex-col gap-6 overflow-y-auto pb-20 md:pb-0 no-scrollbar">
          {/* Prompt Input */}
          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
            <label className="text-sm font-semibold text-slate-300 mb-2 block">
              Describe your thumbnail
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A shocked gamer reacting to a glitch in Minecraft, vibrant colors, neon background..."
              className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleGenerate();
                }
              }}
            />
            <p className="text-xs text-slate-500 mt-2">Press Ctrl+Enter to generate</p>
          </div>

          {/* Style Selector */}
          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
            <label className="text-sm font-semibold text-slate-300 mb-3 block">
              Art Style
            </label>
            <div className="grid grid-cols-1 gap-2">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`flex items-center p-3 rounded-xl border transition-all text-left ${
                    selectedStyle.id === style.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{style.name}</div>
                    <div className="text-xs opacity-70">{style.description}</div>
                  </div>
                  {selectedStyle.id === style.id && <Sparkles className="w-4 h-4 ml-auto text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
            <label className="text-sm font-semibold text-slate-300 mb-3 block">
              Platform / Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setSelectedRatio(ratio)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    selectedRatio.id === ratio.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className={`border-2 border-current rounded-sm mb-2 ${
                    ratio.id === '16:9' ? 'w-8 h-4.5' :
                    ratio.id === '9:16' ? 'w-4.5 h-8' :
                    'w-6 h-6'
                  }`} />
                  <span className="text-[10px] font-medium">{ratio.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* History Sidebar */}
          {showHistory && thumbnails && (
            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Thumbnails</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {thumbnails.length > 0 ? (
                  thumbnails.map((thumbnail) => (
                    <button
                      key={thumbnail._id}
                      onClick={() => setImageUrl(thumbnail.imageUrl || "")}
                      className="w-full text-left p-2 rounded-md bg-slate-950 hover:bg-slate-800 transition-colors"
                    >
                      <p className="text-xs truncate text-slate-300">
                        {thumbnail.title}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No thumbnails yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Area: Preview Canvas */}
        <div className="flex-1 bg-slate-900/30 rounded-3xl border border-slate-800 flex flex-col relative overflow-hidden">
          {/* Toolbar */}
          <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/50">
            <h2 className="font-semibold text-slate-300 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-400"/> Canvas
            </h2>
            <div className="flex gap-2">
              <button
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 disabled:opacity-50 transition-colors"
                disabled={!imageUrl}
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 disabled:opacity-50 transition-colors" disabled={!imageUrl}>
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            {/* Error Display */}
            {error && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 max-w-md w-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-500 font-medium text-sm">Error</p>
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              </div>
            )}

            {!imageUrl && !isLoading && (
              <div className="text-center text-slate-500">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700 border-dashed">
                  <Wand2 className="w-8 h-8 opacity-50" />
                </div>
                <p>Enter a prompt and hit generate to see magic.</p>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                  </div>
                </div>
                <p className="text-indigo-300 font-medium animate-pulse">Generating your masterpiece...</p>
              </div>
            )}

            {imageUrl && !isLoading && (
              <div className="relative group max-h-full max-w-full shadow-2xl shadow-black/50 rounded-lg overflow-hidden border border-slate-700/50">
                <img
                  src={imageUrl}
                  alt="Generated Thumbnail"
                  className="max-h-[60vh] object-contain"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-white text-black rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                  >
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Generate Button (Floating) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className={`px-12 py-4 rounded-full font-bold text-lg flex items-center gap-3 shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${
                !prompt.trim() || isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-white text-slate-950 hover:bg-indigo-50 shadow-indigo-500/20'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
              {isLoading ? 'Generating...' : 'Generate Thumbnail'}
            </button>
          </div>

          {/* Mobile Generate Button (Sticky Bottom) */}
          <div className="md:hidden sticky bottom-0 left-0 right-0 bg-slate-950 p-4 border-t border-slate-800">
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                !prompt.trim() || isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-white text-slate-950 hover:bg-indigo-50'
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
              {isLoading ? 'Dreaming...' : 'Generate Thumbnail'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
