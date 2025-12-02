"use client";

import React, { useState, useEffect } from 'react';
import { Check, Zap, Crown, Rocket, ArrowRight, LayoutTemplate, Sparkles, History, Settings, Menu, X } from 'lucide-react';
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
                  item.id === 'pricing'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.id === 'pricing' && (
                  <div className="absolute inset-0 bg-white/10 rounded-full shadow-inner border border-white/5" />
                )}
                <span className="relative flex items-center gap-2">
                  <item.icon className={`w-4 h-4 ${item.id === 'pricing' ? 'text-indigo-400' : ''}`} />
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
                item.id === 'pricing'
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

const PRICING_TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billing: 'Forever free',
    description: 'Perfect for trying out ThumbGen AI',
    features: [
      '3 image generations per month',
      '3 downloads per month',
      'All aspect ratios',
      'Basic support',
      'Community access',
    ],
    limits: {
      generations: 3,
      downloads: 3,
    },
    icon: Zap,
    color: 'from-slate-600 to-slate-700',
    borderColor: 'border-slate-700',
    buttonStyle: 'bg-white/10 hover:bg-white/20 text-white',
    popular: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 9.99,
    billing: 'per month',
    description: 'Great for content creators',
    features: [
      '100 image generations per month',
      '100 downloads per month',
      'All aspect ratios',
      'Priority support',
      'Early access to features',
      'Custom styles',
    ],
    limits: {
      generations: 100,
      downloads: 100,
    },
    icon: Rocket,
    color: 'from-indigo-600 to-purple-600',
    borderColor: 'border-indigo-500',
    buttonStyle: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    billing: 'per month',
    description: 'For professional creators',
    features: [
      '300 image generations per month',
      '300 downloads per month',
      'All aspect ratios',
      'Premium support',
      'Early access to features',
      'Custom styles',
      'API access',
      'Remove watermarks',
    ],
    limits: {
      generations: 300,
      downloads: 300,
    },
    icon: Crown,
    color: 'from-yellow-500 to-orange-600',
    borderColor: 'border-yellow-500',
    buttonStyle: 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white',
    popular: false,
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (tierId: string) => {
    if (tierId === 'free') {
      // Redirect to signup or just close modal
      window.location.href = '/';
      return;
    }

    try {
      // Call API to create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: tierId,
          billingCycle,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse duration-[10s]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse duration-[7s]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1]">
            Choose Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Plan
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Start for free, upgrade when you're ready. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-white/5 rounded-full border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-400">(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_TIERS.map((tier) => {
            const TierIcon = tier.icon;
            const yearlyPrice = tier.price * 12 * 0.8;
            const displayPrice = billingCycle === 'yearly' ? yearlyPrice / 12 : tier.price;

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-8 ${
                  tier.popular
                    ? 'bg-gradient-to-b from-white/10 to-white/5 border-2 ' + tier.borderColor
                    : 'bg-white/5 border border-white/10'
                } hover:scale-105 transition-all duration-300`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-xs font-bold text-white">
                    MOST POPULAR
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <TierIcon className="w-7 h-7 text-white" />
                </div>

                {/* Tier Name */}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">${displayPrice.toFixed(2)}</span>
                    <span className="text-slate-400">/{billingCycle === 'yearly' ? 'mo' : 'month'}</span>
                  </div>
                  {billingCycle === 'yearly' && tier.price > 0 && (
                    <p className="text-sm text-green-400 mt-1">
                      Billed ${yearlyPrice.toFixed(2)} annually
                    </p>
                  )}
                  {tier.price === 0 && <p className="text-sm text-slate-500 mt-1">{tier.billing}</p>}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(tier.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-8 ${tier.buttonStyle} shadow-lg`}
                >
                  {tier.id === 'free' ? 'Get Started' : 'Subscribe Now'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Features */}
                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I change my plan later?',
                a: 'Yes! You can upgrade or downgrade your plan at any time from your account settings.',
              },
              {
                q: 'What happens when I reach my generation limit?',
                a: "You'll be prompted to upgrade to a higher tier. Your existing generated images will remain accessible.",
              },
              {
                q: 'Do unused generations roll over?',
                a: 'No, generation limits reset at the beginning of each billing cycle.',
              },
              {
                q: 'Is there a free trial for paid plans?',
                a: 'The Free tier lets you try the service before committing to a paid plan.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="inline-block bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-4">Still have questions?</h2>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <button className="px-8 py-3 bg-white text-slate-950 rounded-xl font-bold hover:scale-105 transition-transform">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
