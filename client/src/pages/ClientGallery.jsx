import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, Key, Heart, Download, X, Eye, Grid3X3, HeartHandshake, CheckCircle } from 'lucide-react';
import api from '../services/api';


// Mock event photo datasets
const EVENT_PHOTOS = {
  EMMA26: {
    eventName: 'Emma & Nathan Wedding',
    date: 'June 5, 2026',
    photographer: 'Evelyn Sterling',
    photos: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop', title: 'Ceremony Kiss' },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=800&auto=format&fit=crop', title: 'Bride Portrait' },
      { id: 'p3', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop', title: 'First Dance' },
      { id: 'p4', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop', title: 'Venue Overview' }
    ]
  },
  TECH26: {
    eventName: 'Vanguard Tech Summit',
    date: 'May 18, 2026',
    photographer: 'David Stark',
    photos: [
      { id: 'p5', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop', title: 'Panel Q&A' },
      { id: 'p6', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop', title: 'Audience View' },
      { id: 'p7', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop', title: 'Keynote Speaker' }
    ]
  },
  ELENA4: {
    eventName: 'Elena Portrait Session',
    date: 'April 12, 2026',
    photographer: 'Marcus Vance',
    photos: [
      { id: 'p8', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', title: 'Studio Portrait 1' },
      { id: 'p9', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop', title: 'Studio Portrait 2' },
      { id: 'p10', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop', title: 'Studio Portrait 3' }
    ]
  }
};

export default function ClientGallery() {
  const { code: urlCode } = useParams();
  const navigate = useNavigate();
  
  const [accessCode, setAccessCode] = useState('');
  const [verifiedEvent, setVerifiedEvent] = useState(null);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  const [lovedPhotos, setLovedPhotos] = useState({});
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);

  const getPhotoUrl = (url) => url.startsWith('/') ? 'http://localhost:5000' + url : url;

  // Auto-verify if code is provided directly in URL path (e.g. /gallery/EMMA26)
  useEffect(() => {
    if (urlCode) {
      const verifyCode = async () => {
        const codeUpper = urlCode.toUpperCase();
        try {
          const data = await api.getGallery(codeUpper);
          setVerifiedEvent(data.event ? {
            eventName: data.event.eventName,
            date: data.event.date,
            photographer: 'Owner',
            photos: data.photos
          } : null);
          setIsStandalone(false);
        } catch (err) {
          console.warn("Backend API unavailable for code, using offline mockup data", err);
          if (EVENT_PHOTOS[codeUpper]) {
            setVerifiedEvent(EVENT_PHOTOS[codeUpper]);
            setIsStandalone(true);
          } else {
            setError(`Access code "${urlCode}" is invalid.`);
          }
        }
      };
      verifyCode();
    }
  }, [urlCode]);

  const handleAccessSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const codeUpper = accessCode.trim().toUpperCase();

    try {
      const data = await api.getGallery(codeUpper);
      setVerifiedEvent({
        eventName: data.event.eventName,
        date: data.event.date,
        photographer: 'Owner',
        photos: data.photos
      });
      setIsStandalone(false);
      navigate(`/gallery/${codeUpper}`);
    } catch (err) {
      console.warn("Backend API access failed, trying offline mockup database", err);
      if (EVENT_PHOTOS[codeUpper]) {
        setVerifiedEvent(EVENT_PHOTOS[codeUpper]);
        setIsStandalone(true);
        navigate(`/gallery/${codeUpper}`);
      } else {
        setError('Invalid code. Please check your credentials and try again. (Hint: Use EMMA26, TECH26, or ELENA4)');
      }
    }
  };

  const toggleLove = (id, e) => {
    e.stopPropagation();
    setLovedPhotos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const triggerDownloadAll = async () => {
    setDownloadProgress(0);
    if (!isStandalone && urlCode) {
      try {
        await api.incrementDownloads(urlCode.toUpperCase());
      } catch (err) {
        console.warn("Failed to increment downloads on server", err);
      }
    }
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadProgress(null), 1500);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  // Filter photos based on favorites checkbox
  const displayedPhotos = verifiedEvent
    ? (filterFavorites
        ? verifiedEvent.photos.filter(p => lovedPhotos[p.id])
        : verifiedEvent.photos)
    : [];

  // ENTRY ACCESS SCREEN
  if (!verifiedEvent) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-md w-full glass p-8 rounded-3xl border-white/5 relative z-10">
          <div className="text-center mb-8 flex flex-col items-center gap-2">
            <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400 w-fit">
              <Key className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white">Enter Gallery Access Code</h2>
            <p className="text-xs text-neutral-400">
              Photographers deliver private events with unique PIN codes. Please type yours below to enter the album.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-950/20 border border-red-500/20 text-red-200 text-xs rounded-xl text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleAccessSubmit} className="flex flex-col gap-5 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Access PIN Code</label>
              <input
                type="text"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="e.g. EMMA26"
                className="px-4 py-3 bg-white/5 border border-white/5 hover:border-white/10 focus:border-brand-500/50 rounded-xl focus:outline-none transition-colors text-white font-mono text-center uppercase tracking-widest text-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-semibold text-sm transition-all shadow-md shadow-brand-500/10 cursor-pointer text-center"
            >
              Verify Code
            </button>
          </form>

          <div className="h-px bg-white/5 my-6"></div>
          <div className="text-center">
            <span className="text-[11px] text-neutral-500">
              Trouble logging in? Contact your event photographer or email support@auraprism.com.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // EVENT GALLERY VIEW
  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Event Header Card */}
      <div className="glass p-8 rounded-3xl border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div className="text-left flex flex-col gap-1.5">
          <span className="text-xs text-brand-300 font-semibold uppercase tracking-wider">Client Event Gallery</span>
          <h1 className="font-display font-bold text-3xl text-white">{verifiedEvent.eventName}</h1>
          <p className="text-xs text-neutral-400">Captured by {verifiedEvent.photographer} &bull; Date: {verifiedEvent.date}</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Favorite Switcher */}
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filterFavorites
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'border-white/10 text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className={`w-4 h-4 ${filterFavorites ? 'fill-current' : ''}`} />
            {filterFavorites ? 'Show All Photos' : 'Show Favorites Only'}
          </button>

          {/* Bulk Download */}
          <button
            onClick={triggerDownloadAll}
            disabled={downloadProgress !== null}
            className="flex items-center gap-2 px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-full text-xs font-semibold transition-all shadow-md shadow-brand-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadProgress !== null ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 animate-pulse" />
                Compiling ZIP ({downloadProgress}%)
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                Download Album (ZIP)
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Empty Favorites State */}
      {filterFavorites && displayedPhotos.length === 0 && (
        <div className="py-20 text-center glass rounded-2xl border-white/5 flex flex-col items-center gap-3">
          <Heart className="w-8 h-8 text-neutral-600" />
          <h3 className="font-display font-semibold text-lg text-white">No favorites selected</h3>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            Click the heart button on photos to build your selection list. They will show up here.
          </p>
        </div>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-white/5 glass"
          >
            <img 
              src={getPhotoUrl(photo.url)} 
              alt={photo.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Hover actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-5">
              <div className="flex justify-end">
                <button
                  onClick={(e) => toggleLove(photo.id, e)}
                  className={`p-2 rounded-full glass-light transition-transform active:scale-95 ${
                    lovedPhotos[photo.id] ? 'text-red-500' : 'text-white hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${lovedPhotos[photo.id] ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="font-display font-medium text-white text-xs truncate max-w-[170px] text-left">{photo.title}</h4>
                <div className="p-1.5 bg-brand-500 text-white rounded-full">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 p-3 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full flex flex-col gap-4">
            <div className="relative max-h-[70vh] rounded-xl overflow-hidden border border-white/10">
              <img 
                src={getPhotoUrl(selectedPhoto.url)} 
                alt={selectedPhoto.title} 
                className="w-full h-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 glass rounded-xl border-white/5">
              <div className="flex flex-col gap-1 text-left">
                <h2 className="font-display font-bold text-lg text-white">{selectedPhoto.title}</h2>
                <p className="text-xs text-neutral-400">Part of {verifiedEvent.eventName}</p>
              </div>

              <div className="flex gap-3 mt-4 sm:mt-0">
                <button
                  onClick={(e) => toggleLove(selectedPhoto.id, e)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-medium transition-colors ${
                    lovedPhotos[selectedPhoto.id]
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'border-white/10 text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${lovedPhotos[selectedPhoto.id] ? 'fill-current' : ''}`} />
                  {lovedPhotos[selectedPhoto.id] ? 'Loved' : 'Love'}
                </button>
                <a
                  href={getPhotoUrl(selectedPhoto.url)}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-full text-xs font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
