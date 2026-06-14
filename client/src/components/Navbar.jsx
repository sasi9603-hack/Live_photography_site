import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Camera, Menu, X, User, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="p-2 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-all">
          <Camera className="w-6 h-6 text-brand-400 group-hover:scale-110 transition-transform" />
        </div>
        <span className="font-display font-bold text-xl tracking-wider text-white">
          AURA<span className="text-brand-400">PRISM</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      {!isDashboard && (
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-medium tracking-wide text-sm transition-colors hover:text-white ${
                location.pathname === link.path ? 'text-brand-400' : 'text-neutral-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}

      {/* Auth & CTAs */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          to="/gallery/enter"
          className="px-4 py-2 text-sm font-medium border border-white/10 hover:border-brand-400/30 rounded-full hover:bg-white/5 transition-all text-neutral-300 hover:text-white"
        >
          Client Access
        </Link>
        {isDashboard ? (
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 text-red-200 rounded-full transition-all"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-full transition-all shadow-md shadow-brand-500/10 hover:shadow-brand-500/25"
          >
            <User className="w-4 h-4" />
            Photographer Portal
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-neutral-400 hover:text-white md:hidden rounded-lg hover:bg-white/5"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 glass border-b border-white/10 p-6 flex flex-col gap-4 md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          {!isDashboard && navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium py-1 ${
                location.pathname === link.path ? 'text-brand-400' : 'text-neutral-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-white/5 my-2"></div>
          <Link
            to="/gallery/enter"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-2.5 border border-white/10 rounded-full text-neutral-300 hover:text-white"
          >
            Client Access
          </Link>
          {isDashboard ? (
            <button
              onClick={() => {
                localStorage.removeItem('token');
                setIsOpen(false);
                navigate('/login');
              }}
              className="w-full text-center py-2.5 bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 text-red-200 rounded-full"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-full flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Photographer Portal
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
