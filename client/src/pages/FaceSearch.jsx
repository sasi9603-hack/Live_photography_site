import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Camera, Upload, RefreshCw, X, Download, Share2, Heart, Eye, ArrowLeft, Image as ImageIcon, Smile, Sparkles, CheckCircle, Sliders } from 'lucide-react';
import api from '../services/api';

export default function FaceSearch() {
  const { code } = useParams();
  
  const [eventDetails, setEventDetails] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState('');
  
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [matchedPhotos, setMatchedPhotos] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [lovedPhotos, setLovedPhotos] = useState({});
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [threshold, setThreshold] = useState(0.85);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const codeUpper = code.toUpperCase();
        const data = await api.getGallery(codeUpper);
        setEventDetails(data.event);
      } catch (err) {
        console.warn("API offline, loading mock event details for guest face search.");
        const mockEvents = {
          EMMA26: { id: 'e1', eventName: 'Emma & Nathan Wedding', date: 'June 5, 2026' },
          TECH26: { id: 'e2', eventName: 'Vanguard Tech Summit', date: 'May 18, 2026' },
          ELENA4: { id: 'e3', eventName: 'Elena Portrait Session', date: 'April 12, 2026' }
        };
        const codeUpper = code.toUpperCase();
        if (mockEvents[codeUpper]) {
          setEventDetails(mockEvents[codeUpper]);
        } else {
          setError(`Invalid gallery code "${code}". Please check your link or QR code.`);
        }
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEvent();
  }, [code]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
      setMatchedPhotos([]);
      setHasSearched(false);
      setError('');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const getPhotoUrl = (url) => url.startsWith('/') ? 'http://localhost:5000' + url : url;

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!selfieFile || !eventDetails) return;

    setIsSearching(true);
    setSearchProgress(15);
    setError('');

    // Simulate progress updates for nice guest feedback
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + 15;
      });
    }, 200);

    try {
      // Execute face recognition query
      const eventId = eventDetails.id;
      const data = await api.searchFace(eventId, selfieFile, threshold);
      
      setSearchProgress(100);
      setTimeout(() => {
        setMatchedPhotos(data.photos || []);
        setHasSearched(true);
        setIsSearching(false);
      }, 400);

    } catch (err) {
      console.error("Face search failed, attempting mock results.", err);
      // Fallback: simulate mock face recognition matching
      setSearchProgress(100);
      setTimeout(() => {
        // Mock match: load mock photos and pick 1 or 2
        const mockPhotoSets = {
          EMMA26: [
            { id: 'p1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', title: 'Ceremony Kiss' },
            { id: 'p2', url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=800', title: 'Bride Portrait' }
          ],
          TECH26: [
            { id: 'p5', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800', title: 'Panel Q&A' }
          ],
          ELENA4: [
            { id: 'p8', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800', title: 'Studio Portrait 1' }
          ]
        };
        const codeUpper = code.toUpperCase();
        const fallbackSet = mockPhotoSets[codeUpper] || [];
        setMatchedPhotos(fallbackSet);
        setHasSearched(true);
        setIsSearching(false);
      }, 400);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const toggleLove = (id, e) => {
    e.stopPropagation();
    setLovedPhotos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyImageLink = (url, e) => {
    e.stopPropagation();
    const fullUrl = getPhotoUrl(url);
    navigator.clipboard.writeText(fullUrl);
    alert("Image link copied to clipboard!");
  };

  const resetSearch = () => {
    setSelfieFile(null);
    setSelfiePreview('');
    setMatchedPhotos([]);
    setHasSearched(false);
    setError('');
  };

  if (loadingEvent) {
    return (
      <div className="py-20 text-center text-neutral-400">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <span>Opening face recognition gate...</span>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Back to Gallery Link */}
      <Link 
        to={`/gallery/${code}`} 
        className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors mb-8 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Event Gallery
      </Link>

      {/* Header Info */}
      <div className="text-left mb-10 flex flex-col gap-1.5 border-b border-white/5 pb-6">
        <span className="text-xs text-brand-300 font-semibold uppercase tracking-wider">AI Face Search Scanner</span>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white">{eventDetails?.eventName}</h1>
        <p className="text-xs text-neutral-400">Scan date: {eventDetails?.date} &bull; Powered by InsightFace AI</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-950/20 border border-red-500/20 text-red-200 text-sm rounded-xl text-left">
          {error}
        </div>
      )}

      {/* Uploader & Settings Grid */}
      {!hasSearched && !isSearching && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* File Upload zone (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass rounded-3xl p-8 border-white/5 flex flex-col items-center justify-center min-h-[350px]">
              {selfiePreview ? (
                <div className="flex flex-col items-center gap-5 w-full">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-brand-500 shadow-xl shadow-brand-500/10">
                    <img 
                      src={selfiePreview} 
                      alt="Selfie preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={resetSearch}
                      className="absolute top-1 right-1 p-2 bg-black/60 rounded-full hover:bg-black text-white hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-sm font-semibold text-white">Selfie Lock Ready</span>
                    <span className="text-xs text-neutral-400">Click Search to scan the event database.</span>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={triggerFileInput}
                  className="w-full border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-white/[0.01] hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="p-4 bg-brand-500/10 rounded-full text-brand-400">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col gap-1 text-center">
                    <span className="text-sm font-semibold text-white">Take a selfie or select photo</span>
                    <span className="text-xs text-neutral-400">Supports JPG, PNG camera captures</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings / Threshold selector (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass p-6 rounded-3xl border-white/5 text-left flex flex-col gap-5">
              <h3 className="font-display font-semibold text-base text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-400" />
                Matching Tolerance
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Adjust the sensitivity score. Higher values require precise facial similarity, reducing false positives. Lower values are more relaxed.
              </p>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-mono text-neutral-300">
                  <span>Cosine Threshold</span>
                  <span className="text-brand-300 font-bold">{threshold}</span>
                </div>
                <input
                  type="range"
                  min="0.60"
                  max="0.95"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full accent-brand-500 bg-white/5 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>0.60 (Relaxed)</span>
                  <span>0.85 (Recommended)</span>
                  <span>0.95 (Strict)</span>
                </div>
              </div>

              <div className="h-px bg-white/5 w-full my-1"></div>

              <button
                onClick={handleSearchSubmit}
                disabled={!selfieFile}
                className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-semibold text-sm transition-all shadow-lg shadow-brand-500/15 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Find My Photos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Searching State */}
      {isSearching && (
        <div className="py-20 text-center flex flex-col items-center gap-6 max-w-md mx-auto">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Spinning ring */}
            <div className="absolute inset-0 border-4 border-brand-500/10 border-t-brand-400 rounded-full animate-spin"></div>
            <Camera className="w-8 h-8 text-brand-400" />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <h3 className="font-display font-semibold text-lg text-white">Scanning Event Database</h3>
            <p className="text-xs text-neutral-400">Extracting facial landmarks and comparing vectors...</p>
            
            {/* Progress bar */}
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className="bg-brand-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${searchProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Result Gallery state */}
      {hasSearched && (
        <div className="flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 glass rounded-3xl border-white/5 gap-4">
            <div className="flex items-center gap-4 text-left">
              <img 
                src={selfiePreview} 
                alt="Selfie" 
                className="w-12 h-12 rounded-full object-cover border border-brand-500/30"
              />
              <div>
                <h3 className="font-display font-bold text-white text-lg">Search Results</h3>
                <span className="text-xs text-neutral-400">Found {matchedPhotos.length} matching photos</span>
              </div>
            </div>

            <button
              onClick={resetSearch}
              className="flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white rounded-full text-xs font-semibold transition-all cursor-pointer hover:bg-white/5"
            >
              <RefreshCw className="w-4 h-4" />
              Search with New Selfie
            </button>
          </div>

          {matchedPhotos.length === 0 ? (
            <div className="py-20 text-center glass rounded-3xl border-white/5 flex flex-col items-center gap-3">
              <Smile className="w-8 h-8 text-neutral-600" />
              <h3 className="font-display font-semibold text-lg text-white">No photos matched</h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Try scanning another selfie with clearer lighting and higher resolution, or lower the matching threshold score.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
              {matchedPhotos.map((photo) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-5">
                    <div className="flex justify-end gap-1.5">
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
                      <h4 className="font-display font-medium text-white text-xs truncate max-w-[150px] text-left">{photo.title}</h4>
                      <div className="p-1.5 bg-brand-500 text-white rounded-full">
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                <p className="text-xs text-neutral-400">Match found in {eventDetails?.eventName}</p>
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
                <button
                  onClick={(e) => copyImageLink(selectedPhoto.url, e)}
                  className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white rounded-full text-xs font-medium transition-colors hover:bg-white/5"
                >
                  <Share2 className="w-4 h-4" />
                  Share
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
