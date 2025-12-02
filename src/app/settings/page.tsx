"use client";

import React, { useState, useEffect } from 'react';
import {
  User,
  CreditCard,
  Bell,
  Shield,
  Zap,
  Download,
  TrendingUp,
  Calendar,
  Crown,
  ExternalLink,
  ChevronRight,
  LayoutTemplate,
  Sparkles,
  History,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';

// Navigation Bar Component
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutTemplate, href: '/' },
    { id: 'create', label: 'Create', icon: Sparkles, href: '/' },
    { id: 'library', label: 'Library', icon: History, href: '/' },
    { id: 'pricing', label: 'Pricing', icon: Crown, href: '/pricing' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-inner border border-white/10">
                <Zap className="text-white w-5 h-5 fill-white" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              ThumbGen<span className="text-indigo-400">.ai</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/5 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  item.id === 'settings'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.id === 'settings' && (
                  <div className="absolute inset-0 bg-white/10 rounded-full shadow-inner border border-white/5" />
                )}
                <span className="relative flex items-center gap-2">
                  <item.icon className={`w-4 h-4 ${item.id === 'settings' ? 'text-indigo-400' : ''}`} />
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* User / CTA */}
          <div className="hidden md:flex items-center gap-6">
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
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 w-full p-4 rounded-xl ${
                item.id === 'settings'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

interface UsageStats {
  generationsUsed: number;
  generationsLimit: number;
  downloadsUsed: number;
  downloadsLimit: number;
  currentTier: 'free' | 'standard' | 'pro';
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  subscriptionStatus: 'active' | 'canceled' | 'past_due';
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('subscription');
  const [usage, setUsage] = useState<UsageStats>({
    generationsUsed: 0,
    generationsLimit: 3,
    downloadsUsed: 0,
    downloadsLimit: 3,
    currentTier: 'free',
    billingCycle: 'monthly',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    subscriptionStatus: 'active',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const response = await fetch('/api/usage');
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  const tabs = [
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const tierInfo = {
    free: { name: 'Free', color: 'text-slate-400', generations: 3, downloads: 3 },
    standard: { name: 'Standard', color: 'text-indigo-400', generations: 100, downloads: 100 },
    pro: { name: 'Pro', color: 'text-yellow-400', generations: 300, downloads: 300 },
  };

  const currentTierInfo = tierInfo[usage.currentTier];
  const generationsPercentage = (usage.generationsUsed / usage.generationsLimit) * 100;
  const downloadsPercentage = (usage.downloadsUsed / usage.downloadsLimit) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[0%] w-[30%] h-[30%] bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and subscription</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide border-b border-white/10">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'subscription' && (
              <>
                {/* Current Plan */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Current Plan</h2>
                      <p className="text-slate-400">You're currently on the {currentTierInfo.name} plan</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl bg-white/10 ${currentTierInfo.color} font-bold`}>
                      {currentTierInfo.name.toUpperCase()}
                    </div>
                  </div>

                  {usage.currentTier !== 'free' && (
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Status</span>
                        <span className="text-green-400 font-medium">
                          {usage.subscriptionStatus === 'active' ? 'Active' : usage.subscriptionStatus}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Billing Cycle</span>
                        <span className="text-white font-medium capitalize">{usage.billingCycle}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Next Billing Date</span>
                        <span className="text-white font-medium">{usage.nextBillingDate}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {usage.currentTier === 'free' ? (
                      <button
                        onClick={() => (window.location.href = '/pricing')}
                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        Upgrade Plan
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => (window.location.href = '/pricing')}
                          className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-medium transition-all"
                        >
                          Change Plan
                        </button>
                        <button
                          onClick={handleManageSubscription}
                          className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                          Manage Subscription
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Usage Statistics */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6">Usage This Month</h2>

                  {/* Generations */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium">Image Generations</p>
                          <p className="text-sm text-slate-400">
                            {usage.generationsUsed} of {usage.generationsLimit} used
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">
                        {usage.generationsUsed}/{usage.generationsLimit}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(generationsPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Downloads */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Download className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">Downloads</p>
                          <p className="text-sm text-slate-400">
                            {usage.downloadsUsed} of {usage.downloadsLimit} used
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">
                        {usage.downloadsUsed}/{usage.downloadsLimit}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(downloadsPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {(generationsPercentage > 80 || downloadsPercentage > 80) && (
                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                      <p className="text-sm text-yellow-400">
                        You're running low on {generationsPercentage > 80 && downloadsPercentage > 80 ? 'generations and downloads' : generationsPercentage > 80 ? 'generations' : 'downloads'}. Consider upgrading your plan to continue creating.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'billing' && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Billing</h2>
                <p className="text-slate-400 mb-6">
                  Manage your billing information and view payment history
                </p>
                <button
                  onClick={handleManageSubscription}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  Open Billing Portal
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email notifications', description: 'Receive email updates about your account' },
                    { id: 'usage', label: 'Usage alerts', description: 'Get notified when you reach 80% of your limit' },
                    { id: 'billing', label: 'Billing notifications', description: 'Receive invoices and payment confirmations' },
                    { id: 'features', label: 'New features', description: 'Be the first to know about new features' },
                  ].map((pref) => (
                    <div key={pref.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="font-medium">{pref.label}</p>
                        <p className="text-sm text-slate-400">{pref.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold">Quick Stats</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Total Generated</span>
                  <span className="font-bold text-lg">{usage.generationsUsed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Total Downloads</span>
                  <span className="font-bold text-lg">{usage.downloadsUsed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Plan</span>
                  <span className={`font-bold ${currentTierInfo.color}`}>{currentTierInfo.name}</span>
                </div>
              </div>
            </div>

            {/* Upgrade Card */}
            {usage.currentTier === 'free' && (
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-6">
                <Crown className="w-8 h-8 text-yellow-400 mb-4" />
                <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Get 300 downloads per month and unlock all premium features
                </p>
                <button
                  onClick={() => (window.location.href = '/pricing')}
                  className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 rounded-lg font-medium text-sm transition-all"
                >
                  View Plans
                </button>
              </div>
            )}

            {/* Help Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Shield className="w-8 h-8 text-slate-400 mb-4" />
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-sm text-slate-400 mb-4">
                Our support team is here to assist you with any questions
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-sm transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
