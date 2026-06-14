import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Image as ImageIcon, Calendar, Link as LinkIcon, Trash2, Copy, BarChart3, Database, ShieldAlert, CheckCircle, Upload, X, QrCode } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([
    {
      id: 'e1',
      name: 'Emma & Nathan Wedding',
      date: '2026-06-05',
      code: 'EMMA26',
      photosCount: 45,
      clientEmail: 'emma@gmail.com',
      downloads: 12
    },
    {
      id: 'e2',
      name: 'Vanguard Tech Summit',
      date: '2026-05-18',
      code: 'TECH26',
      photosCount: 68,
      clientEmail: 'admin@vanguard.io',
      downloads: 8
    },
    {
      id: 'e3',
      name: 'Elena Portrait Session',
      date: '2026-04-12',
      code: 'ELENA4',
      photosCount: 7,
      clientEmail: 'elena.v@outlook.com',
      downloads: 4
    }
  ]);

  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(null);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', code: '', clientEmail: '' });
  const [uploadEventId, setUploadEventId] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [dbError, setDbError] = useState('');
  const [isStandalone, setIsStandalone] = useState(false);

  // Check authentication & fetch events
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        setEvents(data.events);
        setIsStandalone(false);
      } catch (err) {
        console.warn("Backend API is offline, using mock client data.", err);
        setIsStandalone(true);
      }
    };

    fetchEvents();
  }, [navigate]);

  // Generate a random uppercase code
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewEvent(prev => ({ ...prev, code }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date || !newEvent.code) return;
    setDbError('');

    try {
      if (!isStandalone) {
        await api.createEvent({
          name: newEvent.name,
          date: newEvent.date,
          code: newEvent.code,
          clientEmail: newEvent.clientEmail || 'client@example.com'
        });
        const fresh = await api.getEvents();
        setEvents(fresh.events);
      } else {
        const created = {
          id: `e${events.length + 1}`,
          name: newEvent.name,
          date: newEvent.date,
          code: newEvent.code.toUpperCase(),
          photosCount: 0,
          clientEmail: newEvent.clientEmail || 'client@example.com',
          downloads: 0
        };
        setEvents([created, ...events]);
      }
      setNewEvent({ name: '', date: '', code: '', clientEmail: '' });
      setShowNewEventModal(false);
    } catch (err) {
      setDbError(err.message || 'Failed to create event');
    }
  };

  const handleDeleteEvent = async (id) => {
    setDbError('');
    try {
      if (!isStandalone) {
        await api.deleteEvent(id);
        const fresh = await api.getEvents();
        setEvents(fresh.events);
      } else {
        setEvents(events.filter(ev => ev.id !== id));
      }
    } catch (err) {
      setDbError(err.message || 'Failed to delete event');
    }
  };

  const copyGalleryLink = (code) => {
    const link = `${window.location.origin}/gallery/${code}`;
    navigator.clipboard.writeText(link);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Upload Logic Simulation
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadFiles(files);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (uploadFiles.length === 0 || !uploadEventId) return;
    setDbError('');

    setUploading(true);
    try {
      if (!isStandalone) {
        await api.uploadPhotos(uploadEventId, uploadFiles);
        const fresh = await api.getEvents();
        setEvents(fresh.events);
      } else {
        // Simulating Cloudinary Upload Progress
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Update the event's photo count
        setEvents(events.map(ev => {
          if (ev.id === uploadEventId) {
            return { ...ev, photosCount: ev.photosCount + uploadFiles.length };
          }
          return ev;
        }));
      }
      setUploading(false);
      setUploadFiles([]);
      setUploadEventId(null);
    } catch (err) {
      setDbError(err.message || 'Image upload failed');
      setUploading(false);
    }
  };

  // Stats calculation
  const totalEvents = events.length;
  const totalPhotos = events.reduce((sum, ev) => sum + ev.photosCount, 0);
  const totalDownloads = events.reduce((sum, ev) => sum + ev.downloads, 0);
  const storageUsed = (totalPhotos * 3.4).toFixed(1); // 3.4 MB average per photo

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div className="text-left">
          <h1 className="font-display font-bold text-3xl text-white">Photographer Dashboard</h1>
          <p className="text-neutral-400 text-sm">Manage your private client galleries, uploads, and usage analytics.</p>
        </div>
        <button
          onClick={() => {
            generateRandomCode();
            setShowNewEventModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-medium transition-all shadow-md shadow-brand-500/10 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Create New Event
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-2xl flex items-center justify-between border-white/5">
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs text-neutral-400 font-medium">Total Events</span>
            <span className="font-display font-bold text-3xl text-white">{totalEvents}</span>
          </div>
          <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex items-center justify-between border-white/5">
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs text-neutral-400 font-medium">Photos Uploaded</span>
            <span className="font-display font-bold text-3xl text-white">{totalPhotos}</span>
          </div>
          <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex items-center justify-between border-white/5">
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs text-neutral-400 font-medium">Storage Usage</span>
            <span className="font-display font-bold text-xl text-white">{storageUsed} MB / 1 GB</span>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-brand-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((storageUsed / 1000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400 shrink-0">
            <Database className="w-6 h-6" />
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex items-center justify-between border-white/5">
          <div className="flex flex-col gap-1 text-left">
            <span className="text-xs text-neutral-400 font-medium">Client Downloads</span>
            <span className="font-display font-bold text-3xl text-white">{totalDownloads}</span>
          </div>
          <div className="p-3 bg-brand-500/10 rounded-xl text-brand-400">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Events List / Table */}
      <div className="glass rounded-2xl border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-display font-semibold text-lg text-white">Active Client Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="p-5">Event Details</th>
                <th className="p-5">Client Access Code</th>
                <th className="p-5">Photos</th>
                <th className="p-5">Downloads</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-5">
                    <div className="flex flex-col text-left">
                      <span className="font-medium text-white">{ev.name}</span>
                      <span className="text-xs text-neutral-500">Date: {ev.date} &bull; Email: {ev.clientEmail}</span>
                    </div>
                  </td>
                  <td className="p-5 font-mono text-brand-300 font-semibold tracking-wide">
                    {ev.code}
                  </td>
                  <td className="p-5">
                    <span className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-neutral-300">
                      {ev.photosCount} Photos
                    </span>
                  </td>
                  <td className="p-5 text-neutral-400">
                    {ev.downloads} times
                  </td>
                  <td className="p-5 text-right flex gap-3 justify-end items-center">
                    <button
                      onClick={() => setUploadEventId(ev.id)}
                      className="p-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                    </button>
                    <button
                      onClick={() => copyGalleryLink(ev.code)}
                      className="p-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-lg transition-colors cursor-pointer"
                      title="Copy link to gallery"
                    >
                      {copiedId === ev.code ? <CheckCircle className="w-4 h-4 text-brand-400" /> : <LinkIcon className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setShowQrModal(ev)}
                      className="p-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-lg transition-colors cursor-pointer"
                      title="Show QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-2 bg-red-950/20 hover:bg-red-900/30 border border-red-500/10 text-red-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      {showNewEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass p-8 rounded-3xl border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-xl text-white text-left">Create New Gallery Event</h3>
              <button 
                onClick={() => setShowNewEventModal(false)}
                className="p-1.5 bg-white/5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="Emma & Nathan Wedding"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  className="px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Event Date</label>
                <input
                  type="date"
                  required
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Client Email</label>
                <input
                  type="email"
                  placeholder="client@gmail.com"
                  value={newEvent.clientEmail}
                  onChange={(e) => setNewEvent({ ...newEvent, clientEmail: e.target.value })}
                  className="px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Access PIN Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="EMMA26"
                    value={newEvent.code}
                    onChange={(e) => setNewEvent({ ...newEvent, code: e.target.value.toUpperCase() })}
                    className="px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500/50 font-mono flex-1"
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 text-xs rounded-xl font-medium"
                  >
                    Regen
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-semibold text-sm transition-all shadow-md shadow-brand-500/10 mt-4"
              >
                Create Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD IMAGES MODAL */}
      {uploadEventId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass p-8 rounded-3xl border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col text-left">
                <h3 className="font-display font-bold text-xl text-white">Upload Event Photos</h3>
                <span className="text-xs text-neutral-400">Photos will be optimized and saved to Cloudinary.</span>
              </div>
              <button 
                onClick={() => {
                  setUploadEventId(null);
                  setUploadFiles([]);
                }}
                className="p-1.5 bg-white/5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-6 text-left">
              {/* Drag n drop simulated area */}
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-white/[0.01] hover:bg-white/[0.02] transition-colors relative cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="p-3.5 bg-brand-500/10 rounded-full text-brand-400">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <span className="text-sm font-semibold text-white">Select files to upload</span>
                <span className="text-xs text-neutral-500">Supports JPG, PNG up to 10MB each</span>
              </div>

              {/* Selected files count / preview */}
              {uploadFiles.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Selected Files ({uploadFiles.length})</span>
                  <div className="max-h-24 overflow-y-auto glass p-3.5 rounded-xl border-white/5 divide-y divide-white/5">
                    {uploadFiles.slice(0, 5).map((file, idx) => (
                      <div key={idx} className="text-xs text-neutral-300 py-1 truncate">{file.name}</div>
                    ))}
                    {uploadFiles.length > 5 && (
                      <div className="text-xs text-brand-300 py-1 font-semibold">And {uploadFiles.length - 5} more...</div>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploadFiles.length === 0 || uploading}
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-semibold text-sm transition-all shadow-md shadow-brand-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {uploading ? 'Processing & Storing Images...' : `Upload ${uploadFiles.length} Photos`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR CODE DISPLAY MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xs w-full glass p-6 rounded-3xl border-white/10 text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center w-full border-b border-white/5 pb-3">
              <span className="font-display font-semibold text-white text-sm">Event Share QR Code</span>
              <button 
                onClick={() => setShowQrModal(null)}
                className="p-1 bg-white/5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Mock QR Code generator */}
            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/gallery/${showQrModal.code}`)}`} 
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>

            <div className="flex flex-col text-center gap-1">
              <span className="text-xs text-white font-medium">{showQrModal.name}</span>
              <span className="text-[10px] text-neutral-400">PIN: {showQrModal.code}</span>
            </div>

            <button
              onClick={() => {
                const link = `${window.location.origin}/gallery/${showQrModal.code}`;
                navigator.clipboard.writeText(link);
                alert("Gallery link copied to clipboard!");
              }}
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-semibold text-neutral-300"
            >
              Copy Link Instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
