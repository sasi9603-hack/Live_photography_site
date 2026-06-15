import React, { useState, useEffect } from 'react';
import { QrCode, Download, Share2, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function QrManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        setEvents(data.events);
        setIsStandalone(false);
      } catch (err) {
        console.warn("API offline, loading mock events for QR codes.");
        setIsStandalone(true);
        // Load mock events
        setEvents([
          { id: 'e1', name: 'Emma & Nathan Wedding', date: '2026-06-05', code: 'EMMA26' },
          { id: 'e2', name: 'Vanguard Tech Summit', date: '2026-05-18', code: 'TECH26' },
          { id: 'e3', name: 'Elena Portrait Session', date: '2026-04-12', code: 'ELENA4' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getEventSearchUrl = (code) => {
    return `${window.location.origin}/gallery/${code}/face-search`;
  };

  const getQrUrl = (code) => {
    const searchUrl = getEventSearchUrl(code);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(searchUrl)}`;
  };

  const downloadQr = async (code, name) => {
    try {
      const response = await fetch(getQrUrl(code));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR-${name.replace(/\s+/g, '-').toLowerCase()}-${code}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download QR code', err);
      // Fallback: open in new tab
      window.open(getQrUrl(code), '_blank');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-400">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <span>Loading QR codes...</span>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-left mb-10">
        <h1 className="font-display font-bold text-3xl text-white">Event QR Code Management</h1>
        <p className="text-neutral-400 text-sm">
          Download and print custom QR Codes for guest tables, entry banners, or cards. Guests can scan to instantly find their photos.
        </p>
      </div>

      {isStandalone && (
        <div className="mb-8 p-4 bg-yellow-950/20 border border-yellow-500/20 text-yellow-200 text-xs rounded-xl text-left flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Offline Preview Mode:</span> Displaying mock events. Connect your database to generate live client gallery codes.
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="py-20 text-center glass rounded-2xl border-white/5 flex flex-col items-center gap-3">
          <QrCode className="w-8 h-8 text-neutral-600" />
          <h3 className="font-display font-semibold text-lg text-white">No active events found</h3>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            Create an event in the dashboard first to generate a guest face-search QR code.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((ev) => (
            <div key={ev.id} className="glass rounded-3xl p-6 border-white/5 flex flex-col items-center text-center gap-5 hover:border-brand-500/20 transition-all duration-300">
              <div className="w-full flex justify-between items-start">
                <span className="text-[10px] bg-brand-500/10 border border-brand-500/20 text-brand-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono">
                  {ev.code}
                </span>
                <div className="flex gap-1.5 text-xs text-neutral-400">
                  <Calendar className="w-3.5 h-3.5 mt-0.5" />
                  <span>{ev.date}</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center">
                <img 
                  src={getQrUrl(ev.code)} 
                  alt={`QR for ${ev.name}`}
                  className="w-48 h-48 select-none"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <h3 className="font-display font-bold text-white text-base truncate">{ev.name}</h3>
                <span className="text-xs text-neutral-400 truncate max-w-full font-mono select-all">
                  {getEventSearchUrl(ev.code)}
                </span>
              </div>

              <div className="h-px bg-white/5 w-full my-1"></div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => downloadQr(ev.code, ev.name)}
                  className="flex items-center justify-center gap-2 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-full text-xs font-semibold transition-all cursor-pointer shadow-md shadow-brand-500/15"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PNG
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getEventSearchUrl(ev.code));
                    alert("Guest face search URL copied to clipboard!");
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white rounded-full text-xs font-semibold transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
