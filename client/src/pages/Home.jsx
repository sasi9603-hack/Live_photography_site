import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Image, Share2, Download, Zap, Heart, Shield, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Instant QR/Link Delivery",
      description: "Generate instant access links and QR codes for clients to scan and access their photos from any device."
    },
    {
      icon: <Image className="w-6 h-6 text-brand-400" />,
      title: "Cloudinary Optimization",
      description: "Photos are dynamically compressed and resized for lightning-fast loads without compromising pixel quality."
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "Secure Client Portals",
      description: "Protect client event albums with secure codes or passwords, ensuring privacy for private celebrations."
    },
    {
      icon: <Heart className="w-6 h-6 text-red-400" />,
      title: "Favorites Selection",
      description: "Allow clients to love/favorite photos directly in the gallery to choose the ones they want printed."
    }
  ];

  const categories = [
    {
      title: "Bridal & Weddings",
      img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
      count: "24 Albums"
    },
    {
      title: "Studio Portraits",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
      count: "18 Albums"
    },
    {
      title: "Corporate & Live Events",
      img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
      count: "32 Albums"
    },
    {
      title: "Fine Art & Landscapes",
      img: "https://images.unsplash.com/photo-1472214222541-d510753a49fa?q=80&w=600&auto=format&fit=crop",
      count: "15 Albums"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="relative py-24 md:py-36 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Background Image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-15"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1600&auto=format&fit=crop')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0a0a]/50 to-[#0b0a0a] z-0"></div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-brand-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto z-10 flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-brand-300 tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Modern Client Galleries
          </div>
          
          <h1 className="font-display font-extrabold text-4xl md:text-7xl tracking-tight text-white leading-tight">
            The Premium Gallery Portal <br />
            For <span className="text-gradient">Professional Photographers</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed">
            Deliver breathtaking photo collections, track client selections, and organize events flawlessly in an ultra-fast, modern portal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link
              to="/login"
              className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-medium transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 text-center flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/gallery/enter"
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-medium transition-all text-neutral-300 hover:text-white text-center"
            >
              Client Gallery Code
            </Link>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col gap-4">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
            Designed for Modern Workflows
          </h2>
          <p className="text-neutral-400">
            A beautiful blend of features built to replace clunky sharing methods and elevate the client handoff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => (
            <div 
              key={index}
              className="glass p-8 rounded-2xl hover:border-brand-400/20 hover:bg-white/[0.04] transition-all duration-300 flex flex-col gap-4 group"
            >
              <div className="p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-white group-hover:text-brand-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Highlight Grid */}
      <section className="py-20 px-6 md:px-12 bg-neutral-950/40 w-full border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="flex flex-col gap-4 max-w-xl">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
                Stunning Portfolio Galleries
              </h2>
              <p className="text-neutral-400">
                Organize client collections into customizable categories. High-fidelity layouts tailored for visual storytellers.
              </p>
            </div>
            <Link 
              to="/portfolio" 
              className="text-brand-400 hover:text-brand-300 text-sm font-semibold flex items-center gap-1 group whitespace-nowrap"
            >
              View Entire Showcase <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <div 
                key={index}
                className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer border border-white/5"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url('${cat.img}')` }}
                ></div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                {/* Text Details */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1 justify-end z-10">
                  <span className="text-xs text-brand-300 font-semibold uppercase tracking-wider">{cat.count}</span>
                  <h3 className="font-display font-bold text-xl text-white">{cat.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive FAQ / Call to Action */}
      <section className="py-24 px-6 md:px-12 text-center max-w-4xl mx-auto w-full z-10">
        <div className="glass p-12 md:p-16 rounded-3xl flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white">
            Ready to Upgrade Your <br />
            Client Handoff?
          </h2>
          <p className="text-neutral-400 max-w-xl leading-relaxed">
            Create an account in less than a minute. Upload your first event, import photos, and deliver a curated experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
            <Link
              to="/login"
              className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-medium transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 text-center"
            >
              Sign Up Now
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-3 border border-white/10 hover:border-white/20 hover:bg-white/5 text-neutral-300 rounded-full font-medium transition-all text-center"
            >
              View Detailed Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
