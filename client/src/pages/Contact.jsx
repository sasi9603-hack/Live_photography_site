import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, HeartHandshake } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, submit to backend
    setSubmitted(true);
  };

  return (
    <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-16 flex flex-col gap-4">
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white">Get in Touch</h1>
        <p className="text-neutral-400 max-w-xl mx-auto">
          Have questions about pricing, storage packages, or custom solutions? Reach out, and we'll reply within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* Contact Info (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass p-8 rounded-2xl flex flex-col gap-6 h-full border-white/5">
            <h3 className="font-display font-semibold text-lg text-white">Contact Information</h3>
            <p className="text-sm text-neutral-400">
              For immediate support regarding account billing or active client galleries, use the email below.
            </p>

            <div className="flex flex-col gap-5 mt-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-xl text-brand-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs text-neutral-500">Email us</span>
                  <a href="mailto:hello@auraprism.com" className="text-sm text-neutral-200 hover:text-brand-400 transition-colors">
                    hello@auraprism.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-xl text-brand-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs text-neutral-500">Call us</span>
                  <a href="tel:+14155552671" className="text-sm text-neutral-200 hover:text-brand-400 transition-colors">
                    +1 (415) 555-2671
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-xl text-brand-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs text-neutral-500">Location</span>
                  <span className="text-sm text-neutral-200">
                    San Francisco, CA 94107
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 my-4"></div>
            
            <div className="flex gap-2 items-center text-xs text-neutral-400 mt-auto">
              <HeartHandshake className="w-4 h-4 text-brand-400" />
              <span>We value your experience and privacy.</span>
            </div>
          </div>
        </div>

        {/* Contact Form (8 cols) */}
        <div className="lg:col-span-8">
          <div className="glass p-8 md:p-10 rounded-2xl border-white/5">
            {submitted ? (
              <div className="py-12 flex flex-col items-center gap-4 text-center animate-in zoom-in-95 duration-300">
                <div className="p-4 bg-brand-500/10 rounded-full border border-brand-500/20 text-brand-400 mb-2">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white">Message Dispatched!</h3>
                <p className="text-sm text-neutral-400 max-w-sm">
                  Thank you for reaching out. A client specialist will be in touch with you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-semibold text-neutral-300 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
                <h3 className="font-display font-semibold text-lg text-white">Send a Message</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="px-4 py-3 bg-white/5 border border-white/5 hover:border-white/10 focus:border-brand-500/50 rounded-xl focus:outline-none transition-colors text-white text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="px-4 py-3 bg-white/5 border border-white/5 hover:border-white/10 focus:border-brand-500/50 rounded-xl focus:outline-none transition-colors text-white text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="General Inquiry, API Integration, Custom Tier"
                    className="px-4 py-3 bg-white/5 border border-white/5 hover:border-white/10 focus:border-brand-500/50 rounded-xl focus:outline-none transition-colors text-white text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Message</label>
                  <textarea
                    id="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry..."
                    className="px-4 py-3 bg-white/5 border border-white/5 hover:border-white/10 focus:border-brand-500/50 rounded-xl focus:outline-none transition-colors text-white text-sm resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-semibold text-sm transition-all shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 w-full md:w-fit"
                >
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
