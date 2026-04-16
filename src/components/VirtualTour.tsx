import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCw, Maximize2, X, Box, Eye } from 'lucide-react';

interface VirtualTourProps {
  tour: {
    type: '360' | 'video';
    exteriorUrl?: string;
    interiorUrl?: string;
    videoUrl?: string;
  };
  onClose: () => void;
}

export default function VirtualTour({ tour, onClose }: VirtualTourProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'interior' | 'exterior'>('interior');

  useEffect(() => {
    if (tour.type === '360' && viewMode === 'interior' && tour.interiorUrl) {
      // Load Pannellum dynamically to ensure it's available
      const loadPannellum = async () => {
        if (!(window as any).pannellum) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
          script.async = true;
          document.body.appendChild(script);

          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
          document.head.appendChild(link);

          script.onload = () => initViewer();
        } else {
          initViewer();
        }
      };

      const initViewer = () => {
        if (viewerRef.current) {
          (window as any).pannellum.viewer(viewerRef.current, {
            type: 'equirectangular',
            panorama: tour.interiorUrl,
            autoLoad: true,
            showControls: false,
          });
        }
      };

      loadPannellum();
    }
  }, [tour, viewMode]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col"
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-[#3b82f6] p-2 rounded-lg">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold uppercase tracking-widest text-sm">Virtual Test Drive</h2>
            <p className="text-[10px] text-[#8e9299] uppercase tracking-widest">Experience the future of car buying</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow relative flex items-center justify-center overflow-hidden">
        {tour.type === 'video' ? (
          <div className="w-full h-full p-4 md:p-12 flex items-center justify-center">
            <video 
              src={tour.videoUrl} 
              controls 
              autoPlay 
              className="max-w-full max-h-full rounded-[2rem] shadow-2xl border border-white/10"
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
             {/* 360 Viewer */}
             <div className="flex-grow relative">
                {viewMode === 'interior' ? (
                  <div ref={viewerRef} className="w-full h-full bg-[#121214]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#121214]">
                    <img 
                      src={tour.exteriorUrl} 
                      alt="Exterior 360" 
                      className="max-w-full max-h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                        <RotateCw className="w-4 h-4 animate-spin-slow" />
                        Exterior 360 View
                      </div>
                    </div>
                  </div>
                )}
             </div>

             {/* Controls */}
             <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-xl p-2 rounded-2xl border border-white/10">
                <button 
                  onClick={() => setViewMode('interior')}
                  className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'interior' ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/20' : 'text-[#8e9299] hover:text-white'}`}
                >
                  <Eye className="w-4 h-4" />
                  Interior
                </button>
                <button 
                  onClick={() => setViewMode('exterior')}
                  className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'exterior' ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/20' : 'text-[#8e9299] hover:text-white'}`}
                >
                  <Box className="w-4 h-4" />
                  Exterior
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-black/50 backdrop-blur-xl border-t border-white/10 flex justify-center">
        <p className="text-[10px] text-[#8e9299] uppercase tracking-[0.2em] font-bold">
          Powered by AutoElite AI Vision &bull; 4K High Fidelity Rendering
        </p>
      </div>
    </motion.div>
  );
}
