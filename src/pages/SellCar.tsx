import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Car, DollarSign, Calendar, Gauge, MapPin, Info, Image as ImageIcon, Plus, X, Box, Play, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

export default function SellCar() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [virtualTour, setVirtualTour] = useState({
    enabled: false,
    type: '360' as '360' | 'video',
    exteriorUrl: '',
    interiorUrl: '',
    videoUrl: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!auth.currentUser) {
        toast.error('Please sign in to access this feature');
        navigate('/auth');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const role = userDoc.data()?.role;
      
      if (role !== 'admin' && auth.currentUser.email !== 'muazz16607@gmail.com') {
        toast.error('Unauthorized: Only admins can list vehicles.');
        navigate('/');
      }
    };
    checkAdmin();
  }, [navigate]);

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: '',
    description: '',
    category: 'Sedan'
  });

  const handleAddImage = () => {
    if (imageUrl && images.length < 5) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    } else if (images.length >= 5) {
      toast.error('Maximum 5 images allowed');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error('Please sign in to list a car');
      navigate('/auth');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least one image URL');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'cars'), {
        ...formData,
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        year: Number(formData.year),
        sellerUid: auth.currentUser.uid,
        images,
        virtualTour: virtualTour.enabled ? {
          type: virtualTour.type,
          ...(virtualTour.type === '360' ? {
            exteriorUrl: virtualTour.exteriorUrl,
            interiorUrl: virtualTour.interiorUrl
          } : {
            videoUrl: virtualTour.videoUrl
          })
        } : null,
        status: 'available',
        createdAt: new Date().toISOString()
      });
      toast.success('Car listed successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-wider">List Your Vehicle</h1>
          <p className="text-[#8e9299]">Showcase your car to our premium network of buyers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-dark p-8"
          >
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-widest text-sm">
              <Info className="w-5 h-5 text-[#3b82f6]" />
              Vehicle Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Listing Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 2023 Tesla Model S Plaid - Mint Condition"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Brand</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Tesla"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Model</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Model S"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Year</label>
                <input 
                  type="number" 
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                >
                  <option className="bg-[#121214]">Sedan</option>
                  <option className="bg-[#121214]">SUV</option>
                  <option className="bg-[#121214]">Hatchback</option>
                  <option className="bg-[#121214]">Electric</option>
                  <option className="bg-[#121214]">Luxury</option>
                  <option className="bg-[#121214]">Coupe</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Specs & Pricing */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-dark p-8"
          >
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-widest text-sm">
              <DollarSign className="w-5 h-5 text-[#3b82f6]" />
              Specs & Pricing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Price ($)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 85000"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Mileage (mi)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 12000"
                  value={formData.mileage}
                  onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Fuel Type</label>
                <select 
                  value={formData.fuelType}
                  onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                >
                  <option className="bg-[#121214]">Petrol</option>
                  <option className="bg-[#121214]">Diesel</option>
                  <option className="bg-[#121214]">Electric</option>
                  <option className="bg-[#121214]">Hybrid</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Transmission</label>
                <select 
                  value={formData.transmission}
                  onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                >
                  <option className="bg-[#121214]">Automatic</option>
                  <option className="bg-[#121214]">Manual</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Los Angeles, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Tell potential buyers about the condition, features, and history of the car..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Images */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-dark p-8"
          >
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-widest text-sm">
              <ImageIcon className="w-5 h-5 text-[#3b82f6]" />
              Vehicle Images
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Paste image URL here..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-grow px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                />
                <button 
                  type="button"
                  onClick={handleAddImage}
                  className="btn-primary px-8"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-[#8e9299]">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{images.length}/5</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-[#8e9299] italic uppercase tracking-widest">Tip: Use high-quality image URLs for best results.</p>
            </div>
          </motion.div>

          {/* Virtual Tour */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-dark p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-widest text-sm">
                <Box className="w-5 h-5 text-[#3b82f6]" />
                Virtual Test Drive (Optional)
              </h2>
              <button 
                type="button"
                onClick={() => setVirtualTour({...virtualTour, enabled: !virtualTour.enabled})}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${virtualTour.enabled ? 'bg-[#3b82f6] text-white' : 'bg-white/5 text-[#8e9299]'}`}
              >
                {virtualTour.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {virtualTour.enabled && (
              <div className="space-y-6">
                <div className="flex gap-4 p-1 bg-white/5 rounded-xl border border-white/10">
                  <button 
                    type="button"
                    onClick={() => setVirtualTour({...virtualTour, type: '360'})}
                    className={`flex-grow py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${virtualTour.type === '360' ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/20' : 'text-[#8e9299] hover:text-white'}`}
                  >
                    <RotateCw className="w-4 h-4" />
                    360 Interactive
                  </button>
                  <button 
                    type="button"
                    onClick={() => setVirtualTour({...virtualTour, type: 'video'})}
                    className={`flex-grow py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${virtualTour.type === 'video' ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/20' : 'text-[#8e9299] hover:text-white'}`}
                  >
                    <Play className="w-4 h-4" />
                    Video Walkthrough
                  </button>
                </div>

                {virtualTour.type === '360' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Exterior 360 URL</label>
                      <input 
                        type="text" 
                        placeholder="Paste exterior 360 image URL..."
                        value={virtualTour.exteriorUrl}
                        onChange={(e) => setVirtualTour({...virtualTour, exteriorUrl: e.target.value})}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Interior Panorama URL</label>
                      <input 
                        type="text" 
                        placeholder="Paste interior panorama URL..."
                        value={virtualTour.interiorUrl}
                        onChange={(e) => setVirtualTour({...virtualTour, interiorUrl: e.target.value})}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Video Walkthrough URL</label>
                    <input 
                      type="text" 
                      placeholder="Paste video URL (MP4, YouTube, etc.)..."
                      value={virtualTour.videoUrl}
                      onChange={(e) => setVirtualTour({...virtualTour, videoUrl: e.target.value})}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                    />
                  </div>
                )}
                <p className="text-[10px] text-[#8e9299] italic uppercase tracking-widest">Note: For 360 interior, use equirectangular panorama images.</p>
              </div>
            )}
          </motion.div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-6 text-xl disabled:opacity-50"
          >
            {loading ? 'Listing Vehicle...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
