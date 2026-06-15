import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Image as ImageIcon, Search, CheckCircle2, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import api from '../services/api';

export default function FaceStats() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalPhotos: 0,
    totalFacesDetected: 0,
    totalFaceSearches: 0,
    successfulMatches: 0
  });
  const [loading, setLoading] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getFaceStats();
        setStats(data.stats);
        setIsStandalone(false);
      } catch (err) {
        console.warn("API offline, setting mock metrics for stats dashboard.");
        setIsStandalone(true);
        // Load mock stats
        setStats({
          totalEvents: 3,
          totalPhotos: 120,
          totalFacesDetected: 243,
          totalFaceSearches: 58,
          successfulMatches: 51
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const successRate = stats.totalFaceSearches > 0 
    ? Math.round((stats.successfulMatches / stats.totalFaceSearches) * 100) 
    : 0;

  const cards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: <Users className="w-5 h-5 text-blue-400" />,
      desc: "Registered albums in database"
    },
    {
      title: "Processed Photos",
      value: stats.totalPhotos,
      icon: <ImageIcon className="w-5 h-5 text-brand-400" />,
      desc: "Scanned for facial profiles"
    },
    {
      title: "Total Faces Detected",
      value: stats.totalFacesDetected,
      icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
      desc: "Embeddings stored in cloud"
    },
    {
      title: "Total Face Searches",
      value: stats.totalFaceSearches,
      icon: <Search className="w-5 h-5 text-brand-300" />,
      desc: "Selfie query uploads by guests"
    }
  ];

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-400">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <span>Loading face recognition analytics...</span>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-left mb-10 flex justify-between items-start">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Face Recognition Analytics</h1>
          <p className="text-neutral-400 text-sm">
            Monitor background face scanning, detected vectors, guest selfie counts, and match efficiency rates.
          </p>
        </div>
      </div>

      {isStandalone && (
        <div className="mb-8 p-4 bg-yellow-950/20 border border-yellow-500/20 text-yellow-200 text-xs rounded-xl text-left flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Offline Preview Mode:</span> Displaying mock metrics. Start your Express API and connect the FastAPI AI service to monitor real-time scanner statistics.
          </div>
        </div>
      )}

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, idx) => (
          <div key={idx} className="glass p-6 rounded-2xl flex flex-col gap-4 border-white/5 text-left relative overflow-hidden group hover:border-brand-500/20 transition-all duration-300">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">{card.title}</span>
              <div className="p-2.5 bg-white/5 rounded-xl text-neutral-300 group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-display font-extrabold text-3xl text-white tracking-tight">{card.value}</span>
              <span className="text-xs text-neutral-500">{card.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Success Rate Card */}
        <div className="lg:col-span-4 glass p-8 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-brand-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h3 className="font-display font-semibold text-lg text-white">Search Success Rate</h3>

          {/* Circle progress */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                strokeWidth="10"
                stroke="rgba(255,255,255,0.03)"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                strokeWidth="10"
                stroke="url(#progressGradient)"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * successRate) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a48673" />
                  <stop offset="100%" stopColor="#d4c3b6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display font-extrabold text-3xl text-white">{successRate}%</span>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Matches</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-white flex items-center gap-1.5 justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              {stats.successfulMatches} Successful Matches
            </span>
            <span className="text-xs text-neutral-400">
              Out of {stats.totalFaceSearches} total guest face searches.
            </span>
          </div>
        </div>

        {/* Engine Performance Status */}
        <div className="lg:col-span-8 glass p-8 rounded-3xl border-white/5 flex flex-col justify-between text-left gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-400" />
              AI System Status & Efficiency
            </h3>
            <p className="text-sm text-neutral-400">
              Your Face Recognition pipeline runs on the InsightFace deep learning network. When photographers upload photos, the backend parses them for vector coordinate embeddings asynchronously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
            <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
              <h4 className="text-xs font-semibold text-brand-300 uppercase tracking-wider mb-1">Processing Delay</h4>
              <span className="font-display font-bold text-lg text-white">~0.4s / Photo</span>
              <p className="text-[11px] text-neutral-500 mt-1">Average detection and embedding time per image.</p>
            </div>
            <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
              <h4 className="text-xs font-semibold text-brand-300 uppercase tracking-wider mb-1">Similarity Metric</h4>
              <span className="font-display font-bold text-lg text-white">Cosine Similarity</span>
              <p className="text-[11px] text-neutral-500 mt-1">Comparing 512-dimensional floating vectors.</p>
            </div>
          </div>

          <div className="text-xs text-neutral-500 leading-relaxed">
            Guests who upload selfies must present clear lighting and avoid wearing heavy glasses/face coverings. The configurable match threshold defaults to <code className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-neutral-300">0.85</code> for high accuracy.
          </div>
        </div>
      </div>
    </div>
  );
}
