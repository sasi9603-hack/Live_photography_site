import React from 'react';
import { Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: "Free Tier",
      price: "$0",
      description: "Perfect for hobbyist photographers getting started.",
      features: [
        "1 GB Cloudinary Storage",
        "Up to 3 active events",
        "Public portfolio display",
        "Standard ZIP image downloads",
        "Email support"
      ],
      cta: "Get Started",
      popular: false,
      icon: <Zap className="w-5 h-5 text-neutral-400" />
    },
    {
      name: "Professional",
      price: "$19",
      period: "/ month",
      description: "Ideal for freelancer and wedding photographers.",
      features: [
        "50 GB Cloudinary Storage",
        "Unlimited events",
        "Watermark protection",
        "Secure event PIN access",
        "Instant QR codes for event venues",
        "Favorites selection system",
        "Priority email support"
      ],
      cta: "Go Professional",
      popular: true,
      icon: <Sparkles className="w-5 h-5 text-brand-400" />
    },
    {
      name: "Studio Pro",
      price: "$49",
      period: "/ month",
      description: "Engineered for small studios and team setups.",
      features: [
        "500 GB Cloudinary Storage",
        "Multi-photographer accounts",
        "Custom domain support (gallery.yourname.com)",
        "AI face recognition sorting",
        "WhatsApp-based album delivery",
        "Dedicated VIP manager support",
        "Remove all brand tags"
      ],
      cta: "Upgrade to Studio",
      popular: false,
      icon: <ShieldCheck className="w-5 h-5 text-blue-400" />
    }
  ];

  return (
    <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-16 flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-brand-300 tracking-wider uppercase mx-auto">
          Flexible Subscriptions
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white">Simple, Transparent Pricing</h1>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Choose a plan that fits your current volume. Scale seamlessly as you capture more events and client memories.
        </p>
      </div>

      {/* Cards container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-3xl p-8 flex flex-col gap-6 transition-all duration-300 ${
              plan.popular 
                ? 'bg-gradient-to-b from-brand-950/40 to-[#0b0a0a] border-2 border-brand-500 shadow-xl shadow-brand-500/10 md:-translate-y-4' 
                : 'glass border-white/5 hover:border-white/10'
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                Most Popular
              </span>
            )}

            {/* Header info */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  {plan.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-white">{plan.name}</h3>
              </div>
              <p className="text-xs text-neutral-400 min-h-[36px]">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1 my-2">
              <span className="font-display font-extrabold text-4xl md:text-5xl text-white">{plan.price}</span>
              {plan.period && <span className="text-sm text-neutral-400">{plan.period}</span>}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5"></div>

            {/* Features */}
            <ul className="flex flex-col gap-3.5 text-left">
              {plan.features.map((feat, fIdx) => (
                <li key={fIdx} className="flex items-start gap-2.5 text-sm text-neutral-300">
                  <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? 'text-brand-400' : 'text-neutral-400'}`} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              className={`w-full py-3 rounded-full font-semibold text-sm transition-all mt-auto ${
                plan.popular
                  ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ brief */}
      <div className="mt-24 max-w-3xl mx-auto flex flex-col gap-6 text-left">
        <h3 className="font-display font-bold text-2xl text-center text-white mb-4">Pricing Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-white text-sm">Can I change plans later?</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Yes, you can upgrade, downgrade, or cancel your subscription at any time directly through your photographer settings page.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-white text-sm">What happens if I exceed storage?</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              If you reach your limit, we'll notify you. We won't block existing client access, but new photo uploads will be paused until you upgrade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
