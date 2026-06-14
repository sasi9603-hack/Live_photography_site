import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/5 py-12 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Branding */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-500/10 rounded-lg">
              <Camera className="w-5 h-5 text-brand-400" />
            </div>
            <span className="font-display font-bold text-lg tracking-wider text-white">
              AURA<span className="text-brand-400">PRISM</span>
            </span>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Delivering high-end digital galleries for modern photographers and their clients. Elegant, secure, and instant.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm tracking-wider uppercase">Explore</h4>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link to="/" className="text-sm text-neutral-400 hover:text-brand-400 transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/portfolio" className="text-sm text-neutral-400 hover:text-brand-400 transition-colors">Portfolio</Link>
            </li>
            <li>
              <Link to="/pricing" className="text-sm text-neutral-400 hover:text-brand-400 transition-colors">Pricing Plans</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm tracking-wider uppercase">Support</h4>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link to="/contact" className="text-sm text-neutral-400 hover:text-brand-400 transition-colors">Contact Us</Link>
            </li>
            <li>
              <Link to="/gallery/enter" className="text-sm text-neutral-400 hover:text-brand-400 transition-colors">Client Gallery Login</Link>
            </li>
            <li>
              <Link to="/login" className="text-sm text-neutral-400 hover:text-brand-400 transition-colors">Photographer Portal</Link>
            </li>
          </ul>
        </div>

        {/* Social / Contact */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase">Stay Connected</h4>
          <div className="flex gap-4">
            <a href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-brand-500/10 hover:text-brand-400 transition-all text-neutral-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-brand-500/10 hover:text-brand-400 transition-all text-neutral-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" className="p-2.5 bg-white/5 rounded-full hover:bg-brand-500/10 hover:text-brand-400 transition-all text-neutral-400">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="mailto:info@auraprism.com" className="p-2.5 bg-white/5 rounded-full hover:bg-brand-500/10 hover:text-brand-400 transition-all text-neutral-400">
              <Mail className="w-4 h-4" />
            </a>
          </div>
          <span className="text-xs text-neutral-500">
            Email support: support@auraprism.com
          </span>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <span>&copy; {new Date().getFullYear()} AuraPrism. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-neutral-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-neutral-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
