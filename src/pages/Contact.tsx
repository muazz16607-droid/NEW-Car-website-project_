import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you soon.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info */}
          <div className="space-y-12">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl font-bold text-white mb-6 uppercase tracking-wider"
              >
                Get in <span className="text-[#3b82f6]">Touch</span>.
              </motion.h1>
              <p className="text-xl text-[#8e9299] leading-relaxed">
                Have questions about a listing or our platform? Our team is here to help you 24/7.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="bg-white/5 p-4 rounded-2xl text-[#3b82f6] border border-white/10">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Call Us</h3>
                  <p className="text-[#8e9299]">+1 (555) 123-4567</p>
                  <p className="text-[10px] text-[#8e9299] mt-1 opacity-50 uppercase tracking-widest">Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-white/5 p-4 rounded-2xl text-[#3b82f6] border border-white/10">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Email Us</h3>
                  <p className="text-[#8e9299]">support@autoelite.com</p>
                  <p className="text-[10px] text-[#8e9299] mt-1 opacity-50 uppercase tracking-widest">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-white/5 p-4 rounded-2xl text-[#3b82f6] border border-white/10">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1 uppercase tracking-widest text-xs">Visit Us</h3>
                  <p className="text-[#8e9299]">123 Auto Drive, Detroit, MI 48201</p>
                  <p className="text-[10px] text-[#8e9299] mt-1 opacity-50 uppercase tracking-widest">Headquarters</p>
                </div>
              </div>
            </div>

            <div className="card-dark p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                  <MessageCircle className="w-5 h-5 text-[#3b82f6]" />
                  Live Chat
                </h3>
                <p className="text-[#8e9299] text-sm mb-6">Need immediate assistance? Our AI support bot is ready to help.</p>
                <button className="btn-primary px-8 py-3 text-sm">
                  Start Chat
                </button>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-5">
                <MessageCircle className="w-40 h-40" />
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-dark p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">First Name</label>
                  <input type="text" required className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Last Name</label>
                  <input type="text" required className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" required className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Subject</label>
                <select className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all">
                  <option className="bg-[#121214]">General Inquiry</option>
                  <option className="bg-[#121214]">Technical Support</option>
                  <option className="bg-[#121214]">Selling a Car</option>
                  <option className="bg-[#121214]">Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Message</label>
                <textarea required rows={5} className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all resize-none" />
              </div>

              <button 
                type="submit" 
                className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
