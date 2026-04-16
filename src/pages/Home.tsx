import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, ShieldCheck, Zap, Globe, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeInUp, fadeInRight, staggerContainer, springTransition } from '../constants/animations';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.data()?.role === 'admin' || user.email === 'muazz16607@gmail.com');
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);
  const featuredCars = [
    { id: '1', title: 'Tesla Model S Plaid', price: 89900, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800', brand: 'Tesla', year: 2023 },
    { id: '2', title: 'Porsche 911 Carrera', price: 114000, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800', brand: 'Porsche', year: 2022 },
    { id: '3', title: 'BMW M4 Competition', price: 78000, image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800', brand: 'BMW', year: 2023 },
  ];

  return (
    <div className="bg-[#050505] min-h-screen">
      {/* Main Grid Layout from Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Hero Card (span 8) */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="col-span-12 lg:col-span-8 h-[500px] rounded-[20px] overflow-hidden relative group"
          >
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000" 
                alt="Hero" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-end p-10">
              <span className="badge-accent mb-4 w-fit">Hot Deal</span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-[1.1]">
                The New Era of<br />Automotive Excellence.
              </h1>
              <p className="text-[#8e9299] max-w-md mb-8">
                Browse 25,000+ verified listings from trusted sellers nationwide with instant AI financing.
              </p>
              
              <div className="glass-dark p-3 rounded-xl flex items-center gap-4 max-w-xl">
                <Search className="w-5 h-5 text-[#8e9299] ml-2" />
                <input 
                  type="text" 
                  placeholder="Search by make, model, or year..." 
                  className="bg-transparent border-none outline-none text-white flex-grow text-sm"
                />
                <button className="btn-primary py-2 px-6 text-sm">Search</button>
              </div>
            </div>
          </motion.div>

          {/* AI Widget (span 4) */}
          <motion.div 
            variants={fadeInRight}
            initial="initial"
            animate="animate"
            className="col-span-12 lg:col-span-4 card-dark p-8 flex flex-col justify-between bg-[radial-gradient(circle_at_top_right,#1e3a8a_0%,#121214_60%)]"
          >
            <div>
              <span className="badge-accent mb-4 w-fit">AI Market Insight</span>
              <h2 className="text-xl font-bold text-white mb-1">Current Value Trends</h2>
              <p className="text-xs text-[#8e9299]">Luxury Sedan Segment</p>
            </div>
            
            <div className="py-8">
              <p className="text-2xl font-light text-white">
                Average Price: <span className="text-[#10b981] font-bold">+4.2%</span>
              </p>
              <p className="text-xs text-[#8e9299] mt-2 opacity-60">Suggested: Hold for 2 months</p>
            </div>
            
            <div className="h-10 border-b-2 border-[#3b82f6] opacity-30"></div>
          </motion.div>

          {/* Sell CTA (span 4) - Only for Admin */}
          {isAdmin && (
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className="col-span-12 lg:col-span-4 card-dark p-8 flex flex-col items-center justify-center text-center border-dashed"
            >
              <h4 className="text-2xl font-bold text-white mb-2">Inventory Management</h4>
              <p className="text-xs text-[#8e9299] mb-6 max-w-[200px]">
                Add new premium vehicles to your marketplace inventory.
              </p>
              <Link to="/sell" className="btn-outline w-full">Add New Listing</Link>
            </motion.div>
          )}

          {!isAdmin && (
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className="col-span-12 lg:col-span-4 card-dark p-8 flex flex-col items-center justify-center text-center bg-[radial-gradient(circle_at_bottom_left,#1e3a8a_0%,#121214_60%)]"
            >
              <h4 className="text-2xl font-bold text-white mb-2">Find Your Dream.</h4>
              <p className="text-xs text-[#8e9299] mb-6 max-w-[200px]">
                Explore our curated collection of the world's most prestigious vehicles.
              </p>
              <Link to="/browse" className="btn-primary w-full">Explore Collection</Link>
            </motion.div>
          )}

          {/* Featured Grid (span 12) */}
          <div className="col-span-12 mt-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">Featured Inventory</h2>
                <p className="text-sm text-[#8e9299]">Every vehicle undergoes a rigorous verification process by Premium Cars TZ.</p>
              </div>
              <Link to="/browse" className="text-[#3b82f6] text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all uppercase tracking-widest">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredCars.map((car, i) => (
                <motion.div 
                  key={i}
                  variants={fadeInUp}
                  className="card-dark p-4 group cursor-pointer"
                >
                  <div className="relative h-[160px] w-full rounded-xl overflow-hidden mb-4">
                    <img 
                      src={car.image} 
                      alt={car.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 badge-accent !bg-black/50 backdrop-blur-md">
                      {car.year}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-white font-bold group-hover:text-[#3b82f6] transition-colors">{car.title}</h3>
                    <p className="text-[12px] text-[#8e9299]">{car.brand} • Premium</p>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-xl font-bold text-[#3b82f6]">${car.price.toLocaleString()}</span>
                      <span className="text-[10px] text-[#10b981] font-bold uppercase">High Demand</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-[#121214] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              { icon: ShieldCheck, title: 'Verified Listings', desc: 'Every vehicle undergoes a rigorous verification process to ensure quality and safety.' },
              { icon: Zap, title: 'Instant Valuation', desc: 'Get a real-time market value for your car using our AI-driven pricing engine.' },
              { icon: Globe, title: 'Nationwide Reach', desc: 'Connect with buyers and sellers across the country with our expansive network.' }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className="space-y-4">
                <div className="text-[#3b82f6]">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{feature.title}</h3>
                <p className="text-[#8e9299] text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
