"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  LayoutTemplate,
  History,
  Settings,
  Download,
  Share2,
  Zap,
  ChevronRight,
  PlayCircle,
  Instagram,
  Twitter,
  Linkedin,
  Wand2,
  Loader2,
  Menu,
  X,
  Palette,
  Monitor,
  Maximize2,
  Cpu,
  AlertCircle,
  Upload,
  XCircle,
  Crown
} from 'lucide-react';

/**
 * Mock Data & Utilities
 */
const STYLE_PRESETS = [
  { id: 'cinematic', name: 'Cinematic', description: 'High contrast, dramatic lighting, hyper-realistic' },
  { id: '3d-render', name: '3D Render', description: 'Octane render, isometric view, plastic textures' },
  { id: 'anime', name: 'Anime', description: 'Vibrant colors, sharp lines, cel-shaded' },
  { id: 'minimalist', name: 'Minimalist', description: 'Clean, negative space, vector art, flat design' },
  { id: 'clickbait', name: 'High CTR', description: 'Expressive faces, big bold text, bright arrows' },
];

const ASPECT_RATIOS = [
  { id: '16:9', label: 'YouTube', sub: '1920x1080', width: 1920, height: 1080, icon: Monitor },
  { id: '9:16', label: 'TikTok', sub: '1080x1920', width: 1080, height: 1920, icon: Maximize2 },
  { id: '1:1', label: 'Square', sub: '1080x1080', width: 1080, height: 1080, icon: LayoutTemplate },
];

const AI_MODELS = [
  { id: 'google/gemini-3-pro-image-preview', name: 'Gemini 3 Pro Image', description: 'Google\'s image generation model' },
  { id: 'x-ai/grok-4.1-fast', name: 'Grok 4.1 Fast', description: 'X.AI\'s fast generation model' },
  { id: 'x-ai/grok-4.1-fast:free', name: 'Grok 4.1 Fast (Free)', description: 'X.AI\'s fast model - free tier' },
  { id: 'google/gemini-3-pro-preview', name: 'Gemini 3 Pro', description: 'Google\'s advanced AI model' },
  { id: 'openai/gpt-5.1', name: 'GPT-5.1', description: 'OpenAI\'s latest model' },
  { id: 'openai/gpt-5.1-chat', name: 'GPT-5.1 Chat', description: 'OpenAI\'s conversational model' },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * COMPONENTS
 */

// 1. Navigation Bar
const Navbar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutTemplate },
    { id: 'create', label: 'Create', icon: Sparkles },
    { id: 'library', label: 'Library', icon: History },
    { id: 'pricing', label: 'Pricing', icon: Crown, isLink: true, href: '/pricing' },
    { id: 'settings', label: 'Settings', icon: Settings, isLink: true, href: '/settings' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-inner border border-white/10">
                <Zap className="text-white w-5 h-5 fill-white" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              ThumbGen<span className="text-indigo-400">.ai</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/5 backdrop-blur-sm">
            {navItems.map((item) => {
              const Element = 'isLink' in item && item.isLink ? 'a' : 'button';
              return (
                <Element
                  key={item.id}
                  {...('isLink' in item && item.isLink ? { href: item.href } : { onClick: () => setActiveTab(item.id) })}
                  className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === item.id
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {activeTab === item.id && (
                    <div className="absolute inset-0 bg-white/10 rounded-full shadow-inner border border-white/5" />
                  )}
                  <span className="relative flex items-center gap-2">
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-indigo-400' : ''}`} />
                    {item.label}
                  </span>
                </Element>
              );
            })}
          </div>

          {/* User / CTA */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-slate-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden lg:block">
                <div className="text-sm font-medium text-white">John Doe</div>
                <div className="text-xs text-indigo-400">Pro Plan</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10 shadow-lg flex items-center justify-center text-sm font-bold text-white ring-2 ring-transparent hover:ring-indigo-500/50 transition-all cursor-pointer">
                JD
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950 p-4 space-y-2 animate-in slide-in-from-top-5">
          {navItems.map((item) => {
            const Element = 'isLink' in item && item.isLink ? 'a' : 'button';
            return (
              <Element
                key={item.id}
                {...('isLink' in item && item.isLink
                  ? { href: item.href }
                  : {
                      onClick: () => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      },
                    }
                )}
                className={`flex items-center gap-3 w-full p-4 rounded-xl ${
                  activeTab === item.id
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Element>
            );
          })}
        </div>
      )}
    </nav>
  );
};

// 2. Home Page (Landing)
const HomeView = ({ onStartCreating }: { onStartCreating: () => void }) => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse duration-[7s]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-xs font-medium mb-8 backdrop-blur-md shadow-lg shadow-indigo-500/10 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            New: SDXL Turbo Model Available
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            Thumbnails that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
              actually click.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Stop struggling with Photoshop. Our AI analyzes your video concept and generates viral-worthy thumbnails in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={onStartCreating}
              className="group relative px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl" />
              <div className="flex items-center gap-3">
                <Wand2 className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform" />
                <span>Start Creating Free</span>
              </div>
            </button>

            <button className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-3 group">
              <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span>See How It Works</span>
            </button>
          </div>

          {/* Abstract Dashboard Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 h-full w-full pointer-events-none" />
             <div className="relative rounded-t-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-2 shadow-2xl">
                <div className="rounded-t-2xl overflow-hidden opacity-90">
                   <img src="https://placehold.co/1200x600/1e1b4b/FFF?text=Dashboard+Preview&font=montserrat" alt="Dashboard" className="w-full" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Semantic Understanding', desc: 'Our AI reads your video title to understand context deeply.', icon: Sparkles, color: 'text-yellow-400' },
            { title: 'Platform Perfect', desc: 'Auto-formatting for YouTube, Shorts, Reels & TikTok.', icon: LayoutTemplate, color: 'text-blue-400' },
            { title: 'Brand Identity', desc: 'Train the model on your face and branding style.', icon: Zap, color: 'text-pink-400' },
          ].map((feature, idx) => (
            <div key={idx} className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// 3. Generator Workspace
const GeneratorView = ({ addToHistory }: { addToHistory: (item: any) => void }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = (imageUrl: string, filename: string) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'thumbnail.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    let hasError = false;

    // Process all selected files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError('Please upload only image files');
        hasError = true;
        continue;
      }

      // Check file size (max 10MB per image)
      if (file.size > 10 * 1024 * 1024) {
        setError(`Image "${file.name}" is too large. Max size is 10MB`);
        hasError = true;
        continue;
      }

      // Convert to base64
      try {
        const base64String = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        newImages.push(base64String);
      } catch (err) {
        setError('Failed to read one or more image files');
        hasError = true;
      }
    }

    // Add new images to existing ones
    if (newImages.length > 0) {
      setUploadedImages(prev => [...prev, ...newImages]);
      if (!hasError) {
        setError(null);
      }
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAllImages = () => {
    setUploadedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setGeneratedResult(null);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          model: 'google/gemini-3-pro-image-preview',
          width: selectedRatio.width,
          height: selectedRatio.height,
          referenceImages: uploadedImages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (!data.imageUrl) {
        throw new Error('No image was generated. Please try again.');
      }

      const newImage = {
        id: Date.now(),
        prompt: prompt,
        ratio: selectedRatio.id,
        model: 'Gemini 3 Pro Image',
        date: new Date().toLocaleDateString(),
        url: data.imageUrl,
      };

      setGeneratedResult(newImage);
      addToHistory(newImage);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate thumbnail. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col md:flex-row bg-slate-950 relative">
       {/* Background */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[0%] w-[30%] h-[30%] bg-indigo-900/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
       </div>

      {/* Left Sidebar: Controls */}
      <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto pb-20 md:pb-6 p-6 border-r border-white/5 bg-slate-950/50 backdrop-blur-xl z-10 scrollbar-hide">

        {/* Prompt Input */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Prompt
          </label>
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your thumbnail idea..."
              className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none text-sm leading-relaxed shadow-inner"
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-slate-600 bg-black/50 px-2 py-1 rounded-md">
                {prompt.length}/500
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Upload className="w-3 h-3" /> Reference Images (Optional)
            </label>
            {uploadedImages.length > 0 && (
              <button
                onClick={removeAllImages}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All ({uploadedImages.length})
              </button>
            )}
          </div>

          {uploadedImages.length === 0 ? (
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-6 bg-black/40 border border-white/10 border-dashed rounded-2xl hover:bg-black/60 hover:border-indigo-500/50 transition-all group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                    <Upload className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    Click to upload multiple images
                  </div>
                  <div className="text-xs text-slate-600">
                    PNG, JPG, WebP up to 10MB each
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-3">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 group aspect-video">
                    <img
                      src={image}
                      alt={`Reference ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      onClick={() => removeUploadedImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <XCircle className="w-3 h-3 text-white" />
                    </button>
                    <div className="absolute bottom-2 left-2 text-[10px] text-white bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add More Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-xl text-sm text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Add More Images
              </button>
            </div>
          )}
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Monitor className="w-3 h-3" /> Ratio
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setSelectedRatio(ratio)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  selectedRatio.id === ratio.id
                    ? 'bg-indigo-600/10 border-indigo-500/50 text-white'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                 <ratio.icon className={`w-5 h-5 mb-2 ${selectedRatio.id === ratio.id ? 'text-indigo-400' : 'text-slate-600'}`} />
                 <span className="text-[10px] font-bold">{ratio.label}</span>
                 <span className="text-[9px] opacity-50">{ratio.sub}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Right Area: Preview Canvas */}
      <div className="flex-1 flex flex-col relative bg-black/20 z-0">

        {/* Canvas Toolbar */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-950/30 backdrop-blur-sm">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
               <ImageIcon className="w-4 h-4 text-indigo-400"/>
             </div>
             <span className="text-sm font-medium text-slate-300">Generation Canvas</span>
           </div>

           <div className="flex gap-2">
             <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors disabled:opacity-30" disabled={!generatedResult}>
               <Share2 className="w-4 h-4" />
             </button>
             <button
               onClick={() => generatedResult && handleDownload(generatedResult.url, `thumbnail-${generatedResult.id}.png`)}
               className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors disabled:opacity-30"
               disabled={!generatedResult}
             >
               <Download className="w-4 h-4" />
             </button>
           </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
           {/* Grid Pattern Background */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none"></div>

           {/* Empty State */}
           {!generatedResult && !isGenerating && !error && (
             <div className="text-center relative z-10 max-w-md p-8 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
               <div className="w-20 h-20 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/5">
                 <Wand2 className="w-8 h-8 text-indigo-400" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Ready to Imagine</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Enter a prompt in the sidebar and choose your preferred style. The AI usually takes about 5 seconds to dream.
               </p>
             </div>
           )}

           {/* Error State */}
           {error && !isGenerating && (
             <div className="text-center relative z-10 max-w-md p-8 rounded-3xl border border-red-500/20 bg-red-950/20 backdrop-blur-xl">
               <div className="w-20 h-20 bg-gradient-to-tr from-red-900/50 to-red-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-red-500/20">
                 <AlertCircle className="w-8 h-8 text-red-400" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
               <p className="text-red-300 text-sm leading-relaxed mb-4">
                 {error}
               </p>
               <button
                 onClick={() => setError(null)}
                 className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-200 rounded-lg text-sm transition-colors"
               >
                 Try Again
               </button>
             </div>
           )}

           {/* Loading State */}
           {isGenerating && (
             <div className="flex flex-col items-center gap-6 relative z-10">
               <div className="relative">
                 <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse" />
                 <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin relative z-10"></div>
                 <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Sparkles className="w-8 h-8 text-white animate-bounce" />
                 </div>
               </div>
               <div className="text-center space-y-1">
                 <p className="text-lg font-bold text-white tracking-wide">Generating...</p>
                 <p className="text-sm text-indigo-300/70">Diffusing pixels into art</p>
               </div>
             </div>
           )}

           {/* Result State */}
           {generatedResult && !isGenerating && (
             <div className="relative group shadow-2xl shadow-black/80 rounded-xl overflow-hidden border border-white/10 z-10 animate-in zoom-in-95 duration-500">
               <img
                 src={generatedResult.url}
                 alt="Generated Thumbnail"
                 className="max-h-[70vh] w-auto object-contain bg-slate-900"
               />
               {/* Hover Actions */}
               <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                  <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={() => handleDownload(generatedResult.url, `thumbnail-${generatedResult.id}.png`)}
                      className="px-6 py-2.5 bg-white text-slate-950 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-500 hover:scale-105 transition-all shadow-lg shadow-indigo-500/20">
                      Upscale 4x
                    </button>
                  </div>
               </div>
             </div>
           )}
        </div>

        {/* Generate Button Area (Bottom) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
           <button
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl transition-all duration-300 border border-white/10 backdrop-blur-md ${
              !prompt || isGenerating
                ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white hover:-translate-y-1 shadow-indigo-500/25'
            }`}
          >
            {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 fill-white/20" />}
            {isGenerating ? 'Dreaming...' : 'Generate Thumbnail'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Library / History View
const LibraryView = ({ history }: { history: any[] }) => {
  const handleDownload = (imageUrl: string, filename: string) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'thumbnail.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-8 pb-20 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Library</h2>
            <p className="text-slate-400 mt-2 text-sm">You have created {history.length} assets this month.</p>
          </div>
          <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-sm hover:bg-white/10 transition-colors">Select All</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all">Export Selected</button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                 <History className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">It&apos;s quiet here</h3>
              <p className="text-slate-500 max-w-xs text-center leading-relaxed">Your generated masterpieces will appear here. Start creating to fill this space.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {history.map((img) => (
              <div key={img.id} className="group relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                <img src={img.url} alt="History" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium line-clamp-2 leading-snug mb-3">{img.prompt}</p>
                    <div className="flex justify-end items-center">
                        <div className="flex gap-2">
                           <button
                             onClick={() => handleDownload(img.url, `thumbnail-${img.id}.png`)}
                             className="p-2 bg-white text-black rounded-lg hover:bg-indigo-50 transition-colors"
                           >
                              <Download className="w-3 h-3" />
                           </button>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                   <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10">
                    {img.ratio}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * MAIN APP COMPONENT
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState([
      {
          id: 123,
          prompt: "Cyberpunk street food vendor in neon rain, cinematic lighting, 8k resolution, detailed texture",
          style: "Cinematic",
          ratio: "16:9",
          date: "10/24/2023",
          url: "https://placehold.co/1920x1080/0f172a/FFF?text=Cyberpunk+Preview&font=montserrat"
      },
       {
          id: 124,
          prompt: "Minimalist vector logo of a fox, orange and white, flat design",
          style: "Minimalist",
          ratio: "1:1",
          date: "10/25/2023",
          url: "https://placehold.co/1080x1080/1e1b4b/FFF?text=Fox+Logo&font=montserrat"
      }
  ]);

  const addToHistory = (item: any) => {
    setHistory([item, ...history]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="animate-in fade-in duration-700">
        {activeTab === 'home' && (
          <HomeView onStartCreating={() => setActiveTab('create')} />
        )}
        {activeTab === 'create' && (
          <GeneratorView addToHistory={addToHistory} />
        )}
        {activeTab === 'library' && (
          <LibraryView history={history} />
        )}
      </main>

      {/* Footer (Only on Home) */}
      {activeTab === 'home' && (
        <footer className="bg-slate-950/50 backdrop-blur-lg border-t border-white/5 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">© 2024 ThumbGen AI</span>
                </div>
                <div className="flex gap-6">
                    <Instagram className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                    <Twitter className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                    <Linkedin className="w-5 h-5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
                </div>
            </div>
        </footer>
      )}
    </div>
  );
}
