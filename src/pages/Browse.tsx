import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Car } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Gauge, Fuel, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeInUp, scaleUp, staggerContainer } from '../constants/animations';

export default function Browse() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  const brands = ['All', 'Tesla', 'BMW', 'Porsche', 'Audi', 'Mercedes', 'Toyota', 'Honda'];

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const carData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
        setCars(carData);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || car.brand === selectedBrand;
    
    let matchesPrice = true;
    if (priceRange === '0-30k') matchesPrice = car.price <= 30000;
    else if (priceRange === '30k-60k') matchesPrice = car.price > 30000 && car.price <= 60000;
    else if (priceRange === '60k+') matchesPrice = car.price > 60000;

    return matchesSearch && matchesBrand && matchesPrice;
  });

  return (
    <div className="bg-[#050505] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-wider">Marketplace</h1>
            <p className="text-[#8e9299]">Discover over {cars.length} premium vehicles available now.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9299] w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by make, model..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#3b82f6] transition-all outline-none"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-white hover:bg-white/10 transition-all">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:block space-y-8">
            <div className="card-dark p-6">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest text-sm">
                <Filter className="w-4 h-4" />
                Refine Search
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest block mb-3">Brand</label>
                  <div className="space-y-1">
                    {brands.map(brand => (
                      <button 
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedBrand === brand ? 'bg-[#3b82f6] text-white font-bold' : 'text-[#8e9299] hover:bg-white/5'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest block mb-3">Price Range</label>
                  <div className="space-y-1">
                    {['All', '0-30k', '30k-60k', '60k+'].map(range => (
                      <button 
                        key={range}
                        onClick={() => setPriceRange(range)}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${priceRange === range ? 'bg-[#3b82f6] text-white font-bold' : 'text-[#8e9299] hover:bg-white/5'}`}
                      >
                        {range === 'All' ? 'Any Price' : range === '0-30k' ? 'Under $30k' : range === '30k-60k' ? '$30k - $60k' : 'Over $60k'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="card-dark h-96 animate-pulse bg-white/5"></div>
                ))}
              </div>
            ) : filteredCars.length > 0 ? (
              <motion.div 
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredCars.map((car) => (
                    <motion.div
                      layout
                      variants={scaleUp}
                      key={car.id}
                      className="group relative bg-[#121214] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500"
                    >
                      <Link to={`/car/${car.id}`}>
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img 
                            src={car.images[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800'} 
                            alt={car.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-[0.2em] mb-1">{car.brand}</p>
                                <h3 className="text-2xl font-bold text-white tracking-tight">{car.title}</h3>
                              </div>
                              <p className="text-xl font-bold text-white">${car.price.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="absolute top-6 left-6">
                            <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                              {car.year}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 grid grid-cols-3 gap-4 border-t border-white/5">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Mileage</span>
                            <span className="text-xs font-bold text-white">{car.mileage.toLocaleString()} mi</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Fuel</span>
                            <span className="text-xs font-bold text-white">{car.fuelType}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Location</span>
                            <span className="text-xs font-bold text-white truncate">{car.location}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="card-dark p-20 text-center border-dashed">
                <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-[#8e9299]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No cars found</h3>
                <p className="text-[#8e9299]">Try adjusting your filters or search term to find what you're looking for.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedBrand('All'); setPriceRange('All'); }}
                  className="mt-6 text-[#3b82f6] font-bold hover:underline uppercase tracking-widest text-xs"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
