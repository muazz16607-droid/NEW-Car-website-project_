import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Car, User } from '../types';
import { motion } from 'framer-motion';
import { MapPin, Gauge, Fuel, Calendar, ShieldCheck, MessageCircle, Share2, Heart, ArrowLeft, ChevronRight, Box, Play } from 'lucide-react';
import { toast } from 'sonner';
import VirtualTour from '../components/VirtualTour';
import { AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer, fadeIn } from '../constants/animations';

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const carDoc = await getDoc(doc(db, 'cars', id));
        if (carDoc.exists()) {
          const carData = { id: carDoc.id, ...carDoc.data() } as Car;
          
          // Demo Fallback: If no virtual tour exists, provide a sample one for demonstration
          if (!carData.virtualTour) {
            carData.virtualTour = {
              type: '360',
              interiorUrl: 'https://pannellum.org/images/alma.jpg',
              exteriorUrl: carData.images[0]
            };
          }

          setCar(carData);
          
          const sellerDoc = await getDoc(doc(db, 'users', carData.sellerUid));
          if (sellerDoc.exists()) {
            setSeller(sellerDoc.data() as User);
          }
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleContactSeller = async () => {
    if (!auth.currentUser) {
      toast.error('Please sign in to contact the seller');
      navigate('/auth');
      return;
    }

    if (auth.currentUser.uid === car?.sellerUid) {
      toast.error("You can't message yourself!");
      return;
    }

    try {
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, 
        where('participants', 'array-contains', auth.currentUser.uid),
        where('carId', '==', id)
      );
      const querySnapshot = await getDocs(q);
      
      let chatId;
      if (!querySnapshot.empty) {
        chatId = querySnapshot.docs[0].id;
      } else {
        const newChat = await addDoc(collection(db, 'chats'), {
          participants: [auth.currentUser.uid, car?.sellerUid],
          carId: id,
          lastMessage: 'Interested in this car',
          updatedAt: new Date().toISOString()
        });
        chatId = newChat.id;
      }
      
      toast.success('Chat initiated! Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!car) return (
    <div className="min-h-screen bg-[#050505] pt-32 text-center">
      <h2 className="text-2xl font-bold text-white">Car not found</h2>
      <Link to="/browse" className="text-[#3b82f6] mt-4 inline-block font-bold uppercase tracking-widest text-sm">Back to Marketplace</Link>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen">
      {/* Hero Section - Porsche Inspired */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeImage}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            src={car.images[activeImage]} 
            alt={car.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505]"></div>
        
        <div className="absolute bottom-12 left-0 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="bg-[#3b82f6] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">{car.category}</span>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">{car.year} Model</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">{car.title}</h1>
              <div className="flex items-center gap-6 text-white/60 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#3b82f6]" /> {car.location}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#3b82f6]" /> {new Date(car.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 min-w-[300px]"
            >
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Starting at</p>
              <p className="text-5xl font-bold text-white mb-6">${car.price.toLocaleString()}</p>
              <button 
                onClick={handleContactSeller}
                className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#3b82f6] hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                Inquire Now
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Gallery Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {car.images.map((img, i) => (
            <button 
              key={i} 
              onClick={() => setActiveImage(i)}
              className={`flex-shrink-0 w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-[#3b82f6] scale-105' : 'border-transparent opacity-40 hover:opacity-100'}`}
            >
              <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-24">
            {/* Technical Data Section */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-12 tracking-tight">Technical Data</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
                {[
                  { icon: Gauge, label: 'Mileage', value: `${car.mileage.toLocaleString()} mi` },
                  { icon: Fuel, label: 'Fuel Type', value: car.fuelType },
                  { icon: Calendar, label: 'Year', value: car.year },
                  { icon: ShieldCheck, label: 'Transmission', value: car.transmission }
                ].map((spec, i) => (
                  <div key={i} className="bg-[#050505] p-8 flex flex-col items-center text-center group hover:bg-white/5 transition-colors">
                    <spec.icon className="w-6 h-6 text-[#3b82f6] mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">{spec.label}</p>
                    <p className="text-lg font-bold text-white">{spec.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Description Section */}
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">The Concept</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-[#8e9299] text-lg leading-relaxed whitespace-pre-wrap font-light">
                  {car.description}
                </p>
              </div>
            </section>

            {/* Virtual Tour Section */}
            {car.virtualTour && (
              <section className="relative h-[400px] rounded-[3rem] overflow-hidden group cursor-pointer" onClick={() => setShowVirtualTour(true)}>
                <img 
                  src={car.virtualTour.exteriorUrl || car.images[0]} 
                  alt="Virtual Tour Preview" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {car.virtualTour.type === '360' ? <Box className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white fill-white" />}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Experience the Virtual Test Drive</h3>
                  <p className="text-white/60 text-sm font-medium uppercase tracking-widest">Interactive 360&deg; Vision &bull; 4K Walkthrough</p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            {/* Seller Card */}
            <div className="card-dark p-8 space-y-8 sticky top-32">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white font-bold text-2xl overflow-hidden border border-white/10 shadow-2xl">
                  {seller?.photoURL ? <img src={seller.photoURL} alt="Seller" className="w-full h-full object-cover" /> : seller?.displayName?.[0] || 'S'}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-[0.2em] mb-1">Authorized Seller</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{seller?.displayName || 'Private Seller'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleContactSeller}
                  className="w-full btn-primary py-5 flex items-center justify-center gap-3 text-sm"
                >
                  <MessageCircle className="w-6 h-6" />
                  Contact Seller
                </button>
                <div className="flex gap-4">
                  <button className="flex-grow py-4 rounded-xl bg-white/5 text-white font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                    <Heart className="w-4 h-4" /> Save
                  </button>
                  <button className="flex-grow py-4 rounded-xl bg-white/5 text-white font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 text-[#10b981] mb-4">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Verified Listing</span>
                </div>
                <p className="text-[10px] text-[#8e9299] leading-relaxed uppercase tracking-widest">
                  This vehicle has been inspected and verified by Premium Cars TZ experts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showVirtualTour && car?.virtualTour && (
          <VirtualTour 
            tour={car.virtualTour} 
            onClose={() => setShowVirtualTour(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
