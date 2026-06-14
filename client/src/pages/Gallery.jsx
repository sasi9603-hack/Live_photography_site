import React, { useState } from 'react';
import { Camera, X, Eye, Heart, Download } from 'lucide-react';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lovedImages, setLovedImages] = useState({});

  const categories = ['All', 'Weddings', 'Portraits', 'Corporate', 'Landscapes'];

  const photos = [
    {
      id: 1,
      category: 'Weddings',
      title: 'A Promise Under the Canopy',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      photographer: 'Evelyn Sterling',
      date: 'May 2026'
    },
    {
      id: 2,
      category: 'Portraits',
      title: 'Depth of Character',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      photographer: 'Marcus Vance',
      date: 'April 2026'
    },
    {
      id: 3,
      category: 'Landscapes',
      title: 'Whispering Forests',
      url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&auto=format&fit=crop',
      photographer: 'Sienna Woods',
      date: 'March 2026'
    },
    {
      id: 4,
      category: 'Corporate',
      title: 'Innovators Roundtable',
      url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
      photographer: 'David Stark',
      date: 'June 2026'
    },
    {
      id: 5,
      category: 'Weddings',
      title: 'Elegant Embrace',
      url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=800&auto=format&fit=crop',
      photographer: 'Evelyn Sterling',
      date: 'January 2026'
    },
    {
      id: 6,
      category: 'Portraits',
      title: 'Serene Expressions',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
      photographer: 'Marcus Vance',
      date: 'February 2026'
    },
    {
      id: 7,
      category: 'Landscapes',
      title: 'Golden Peak Horizon',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop',
      photographer: 'Sienna Woods',
      date: 'May 2026'
    },
    {
      id: 8,
      category: 'Corporate',
      title: 'Keynote Spectrum',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
      photographer: 'David Stark',
      date: 'November 2025'
    }
  ];

  const filteredPhotos = activeCategory === 'All' 
    ? photos 
    : photos.filter(p => p.category === activeCategory);

  const toggleLove = (id, e) => {
    e.stopPropagation();
    setLovedImages(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-12 flex flex-col gap-4">
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white">Public Portfolio Showcase</h1>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Explore a curation of masterworks spanning across emotional weddings, intimate portraits, landscapes, and dynamic corporate events.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all border ${
              activeCategory === cat 
                ? 'bg-brand-500 border-brand-400 text-white shadow-md shadow-brand-500/10' 
                : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedImage(photo)}
            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-white/5 glass"
          >
            {/* Image */}
            <img 
              src={photo.url} 
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
              {/* Top controls */}
              <div className="flex justify-end">
                <button
                  onClick={(e) => toggleLove(photo.id, e)}
                  className={`p-2 rounded-full glass-light transition-transform active:scale-95 ${
                    lovedImages[photo.id] ? 'text-red-500' : 'text-white hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${lovedImages[photo.id] ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Bottom details */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-brand-300 font-semibold tracking-wider uppercase">{photo.category}</span>
                  <h3 className="font-display font-medium text-white text-sm truncate max-w-[150px]">{photo.title}</h3>
                </div>
                <div className="p-2 bg-brand-500 text-white rounded-full">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hire Banner */}
      <div className="mt-20 glass p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-white/5">
        <div className="flex flex-col gap-2 text-left">
          <h3 className="font-display font-bold text-xl md:text-2xl text-white">Loving what you see?</h3>
          <p className="text-sm text-neutral-400 max-w-xl">
            Our network of curated professional photographers are available for bookings, private sessions, weddings, and commercial campaigns globally.
          </p>
        </div>
        <button className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-medium transition-all shadow-md shadow-brand-500/10">
          Book a Session
        </button>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors border border-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full flex flex-col gap-4">
            <div className="relative max-h-[70vh] rounded-xl overflow-hidden border border-white/10">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="w-full h-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 glass rounded-xl border-white/5">
              <div className="flex flex-col gap-1 text-left">
                <span className="text-xs text-brand-300 font-semibold tracking-wider uppercase">{selectedImage.category}</span>
                <h2 className="font-display font-bold text-xl text-white">{selectedImage.title}</h2>
                <p className="text-xs text-neutral-400">Captured by {selectedImage.photographer} &bull; {selectedImage.date}</p>
              </div>

              <div className="flex gap-3 mt-4 sm:mt-0">
                <button
                  onClick={(e) => toggleLove(selectedImage.id, e)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
                    lovedImages[selectedImage.id]
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'border-white/10 text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${lovedImages[selectedImage.id] ? 'fill-current' : ''}`} />
                  {lovedImages[selectedImage.id] ? 'Liked' : 'Like'}
                </button>
                <a
                  href={selectedImage.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-full text-sm font-medium transition-colors"
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
