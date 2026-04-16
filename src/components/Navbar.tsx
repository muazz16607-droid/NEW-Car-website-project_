import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Car, User, LogOut, LayoutDashboard, Search, PlusCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../constants/animations';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        setUser({ ...currentUser, ...userDoc.data() });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const isAdmin = user?.role === 'admin' || user?.email === 'muazz16607@gmail.com';

  return (
    <nav className="sticky top-0 z-50 bg-[#050505] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-extrabold tracking-[2px] text-[#3b82f6] uppercase">Premium Cars TZ</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-[13px] font-medium text-[#8e9299] hover:text-white uppercase tracking-[1px] transition-colors">Browse</Link>
            {isAdmin && (
              <Link to="/sell" className="text-[13px] font-medium text-[#8e9299] hover:text-white uppercase tracking-[1px] transition-colors">Sell Car</Link>
            )}
            <Link to="/about" className="text-[13px] font-medium text-[#8e9299] hover:text-white uppercase tracking-[1px] transition-colors">About</Link>
            <Link to="/contact" className="text-[13px] font-medium text-[#8e9299] hover:text-white uppercase tracking-[1px] transition-colors">Contact</Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/dashboard" className="flex items-center space-x-1 text-[13px] font-medium text-[#8e9299] hover:text-white uppercase tracking-[1px]">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isAdmin ? 'Admin Dashboard' : 'My Account'}</span>
                </Link>
                <button onClick={handleLogout} className="text-[13px] font-medium text-red-500 hover:text-red-400 uppercase tracking-[1px] flex items-center space-x-1">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth" className="text-[13px] font-semibold text-white px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-all uppercase tracking-[1px]">
                  Sign In
                </Link>
                <Link to="/auth" className="text-[13px] font-semibold text-white px-6 py-2 bg-[#3b82f6] rounded-lg hover:opacity-90 transition-all uppercase tracking-[1px]">
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-[#8e9299]">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-[#050505] border-t border-white/10 overflow-hidden"
          >
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="px-4 pt-2 pb-6 space-y-2"
            >
              {[
                { to: "/browse", label: "Browse" },
                ...(isAdmin ? [{ to: "/sell", label: "Sell Car" }] : []),
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <motion.div key={link.to} variants={fadeInUp}>
                  <Link 
                    to={link.to} 
                    onClick={() => setIsMenuOpen(false)} 
                    className="block px-3 py-2 text-[13px] font-medium text-[#8e9299] hover:text-white uppercase tracking-[1px]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              {user ? (
                <motion.div variants={staggerContainer} className="space-y-2">
                  <motion.div variants={fadeInUp}>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-[13px] font-medium text-[#8e9299] hover:text-white uppercase tracking-[1px]">
                      {isAdmin ? 'Admin Dashboard' : 'My Account'}
                    </Link>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-[13px] font-medium text-red-500 uppercase tracking-[1px]">Logout</button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div variants={fadeInUp}>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-[13px] font-medium text-[#3b82f6] uppercase tracking-[1px]">Sign In</Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
