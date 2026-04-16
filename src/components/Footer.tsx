import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Car } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Footer() {
  const [settings, setSettings] = useState({
    contactEmail: 'support@premiumcarstz.com',
    contactPhone: '+255 123 456 789',
    contactAddress: 'Dar es Salaam, Tanzania',
    facebookUrl: '#',
    twitterUrl: '#',
    instagramUrl: '#'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'settings'));
        if (!querySnapshot.empty) {
          setSettings(querySnapshot.docs[0].data() as any);
        }
      } catch (error) {
        console.error("Error fetching footer settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#050505] text-[#8e9299] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-8">
              <div className="bg-[#3b82f6] p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white uppercase">Premium Cars TZ</span>
            </div>
            <p className="text-sm leading-relaxed mb-8 opacity-80">
              The most trusted marketplace for buying and selling premium vehicles. Experience the future of automotive commerce.
            </p>
            <div className="flex space-x-6">
              <a href={settings.facebookUrl} className="text-[#8e9299] hover:text-[#3b82f6] transition-all"><Facebook className="w-5 h-5" /></a>
              <a href={settings.twitterUrl} className="text-[#8e9299] hover:text-[#3b82f6] transition-all"><Twitter className="w-5 h-5" /></a>
              <a href={settings.instagramUrl} className="text-[#8e9299] hover:text-[#3b82f6] transition-all"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/browse" className="hover:text-[#3b82f6] transition-colors">Browse Cars</Link></li>
              <li><Link to="/sell" className="hover:text-[#3b82f6] transition-colors">Sell Your Car</Link></li>
              <li><Link to="/about" className="hover:text-[#3b82f6] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#3b82f6] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Categories</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/browse?cat=SUV" className="hover:text-[#3b82f6] transition-colors">SUVs</Link></li>
              <li><Link to="/browse?cat=Sedan" className="hover:text-[#3b82f6] transition-colors">Sedans</Link></li>
              <li><Link to="/browse?cat=Electric" className="hover:text-[#3b82f6] transition-colors">Electric Vehicles</Link></li>
              <li><Link to="/browse?cat=Luxury" className="hover:text-[#3b82f6] transition-colors">Luxury Cars</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#3b82f6]" />
                <span className="opacity-80">{settings.contactPhone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#3b82f6]" />
                <span className="opacity-80">{settings.contactEmail}</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#3b82f6]" />
                <span className="opacity-80">{settings.contactAddress}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest">
          <p className="opacity-50">&copy; {new Date().getFullYear()} Premium Cars TZ. All rights reserved.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="opacity-50 hover:opacity-100 hover:text-[#3b82f6] transition-all">Privacy Policy</a>
            <a href="#" className="opacity-50 hover:opacity-100 hover:text-[#3b82f6] transition-all">Terms of Service</a>
            <a href="#" className="opacity-50 hover:opacity-100 hover:text-[#3b82f6] transition-all">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
