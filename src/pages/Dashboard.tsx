import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import { Car, Chat } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Car as CarIcon, MessageSquare, User, Settings, Trash2, Edit3, ExternalLink, Plus, Users, Shield, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fadeInRight, fadeInLeft, staggerContainer, fadeInUp } from '../constants/animations';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'listings' | 'chats' | 'profile' | 'siteSettings' | 'users'>('listings');
  const [myCars, setMyCars] = useState<Car[]>([]);
  const [myChats, setMyChats] = useState<Chat[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('user');
  const [siteSettings, setSiteSettings] = useState({
    contactEmail: 'support@premiumcarstz.com',
    contactPhone: '+255 123 456 789',
    contactAddress: 'Dar es Salaam, Tanzania',
    facebookUrl: '#',
    twitterUrl: '#',
    instagramUrl: '#'
  });
  const navigate = useNavigate();
  const isAdmin = userRole === 'admin' || auth.currentUser?.email === 'muazz16607@gmail.com';

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) {
        navigate('/auth');
        return;
      }

      setLoading(true);
      try {
        // Fetch current user role
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const role = userDoc.data()?.role || 'user';
        setUserRole(role);
        const currentIsAdmin = role === 'admin' || auth.currentUser.email === 'muazz16607@gmail.com';

        // Fetch Cars (All if admin, else only mine)
        const carsQ = currentIsAdmin 
          ? query(collection(db, 'cars'))
          : query(collection(db, 'cars'), where('sellerUid', '==', auth.currentUser.uid));
        
        const carsSnapshot = await getDocs(carsQ);
        setMyCars(carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car)));

        // Fetch My Chats
        const chatsQ = query(collection(db, 'chats'), where('participants', 'array-contains', auth.currentUser.uid));
        const chatsSnapshot = await getDocs(chatsQ);
        setMyChats(chatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat)));

        // Fetch Site Settings if Admin
        if (currentIsAdmin) {
          const settingsDoc = await getDocs(collection(db, 'settings'));
          if (!settingsDoc.empty) {
            setSiteSettings(settingsDoc.docs[0].data() as any);
          }

          // Fetch All Users for Management
          const usersSnapshot = await getDocs(collection(db, 'users'));
          setAllUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const settingsRef = collection(db, 'settings');
      const settingsSnapshot = await getDocs(settingsRef);
      
      if (settingsSnapshot.empty) {
        await addDoc(settingsRef, siteSettings);
      } else {
        await updateDoc(doc(db, 'settings', settingsSnapshot.docs[0].id), siteSettings);
      }
      toast.success('Site settings updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteDoc(doc(db, 'cars', carId));
        setMyCars(myCars.filter(c => c.id !== carId));
        toast.success('Listing deleted');
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleMarkSold = async (carId: string) => {
    try {
      await updateDoc(doc(db, 'cars', carId), { status: 'sold' });
      setMyCars(myCars.map(c => c.id === carId ? { ...c, status: 'sold' } : c));
      toast.success('Car marked as sold!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const userToUpdate = allUsers.find(u => u.id === userId);
    
    if (userToUpdate?.email === 'muazz16607@gmail.com') {
      toast.error("Cannot change role of the Super Admin");
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setAllUsers(allUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-2">
            {[
              { id: 'listings', icon: CarIcon, label: isAdmin ? 'Manage Listings' : 'My Listings' },
              { id: 'chats', icon: MessageSquare, label: 'Messages' },
              { id: 'profile', icon: User, label: 'Profile Settings' },
              ...(isAdmin ? [
                { id: 'users', icon: Users, label: 'User Management' },
                { id: 'siteSettings', icon: Settings, label: 'Site Settings' }
              ] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/20' : 'text-[#8e9299] hover:bg-white/5'}`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {activeTab === 'listings' && (
                <motion.div
                  key="listings"
                  variants={fadeInRight}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{isAdmin ? 'All Listings' : 'My Listings'}</h2>
                    {isAdmin && (
                      <Link to="/sell" className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Listing
                      </Link>
                    )}
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => <div key={i} className="h-32 card-dark animate-pulse bg-white/5"></div>)}
                    </div>
                  ) : myCars.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {myCars.map((car) => (
                        <div key={car.id} className="card-dark p-4 flex flex-col sm:flex-row gap-6 group">
                          <div className="w-full sm:w-48 aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-white/5">
                            <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-grow py-2">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-[#3b82f6] transition-colors">{car.title}</h3>
                                <p className="text-sm text-[#8e9299]">${car.price.toLocaleString()} • {car.status}</p>
                              </div>
                              <div className="flex gap-2">
                                <Link to={`/car/${car.id}`} className="p-2 rounded-xl bg-white/5 text-[#8e9299] hover:text-[#3b82f6] transition-all">
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                                <button onClick={() => handleDeleteCar(car.id)} className="p-2 rounded-xl bg-white/5 text-[#8e9299] hover:text-red-500 transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                              {car.status === 'available' && (
                                <button 
                                  onClick={() => handleMarkSold(car.id)}
                                  className="text-[10px] font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg hover:bg-green-500/20 transition-all uppercase tracking-widest"
                                >
                                  Mark as Sold
                                </button>
                              )}
                              <button className="text-[10px] font-bold text-[#3b82f6] bg-[#3b82f6]/10 px-3 py-1.5 rounded-lg hover:bg-[#3b82f6]/20 transition-all uppercase tracking-widest">
                                Edit Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="card-dark p-16 text-center border-dashed">
                      <CarIcon className="w-12 h-12 text-[#8e9299] mx-auto mb-4 opacity-20" />
                      <p className="text-[#8e9299] font-medium">You haven't listed any cars yet.</p>
                      <Link to="/sell" className="text-[#3b82f6] font-bold mt-2 inline-block hover:underline uppercase tracking-widest text-xs">Start selling today</Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'chats' && (
                <motion.div
                  key="chats"
                  variants={fadeInRight}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-8">Messages</h2>
                  {myChats.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {myChats.map((chat) => (
                        <div key={chat.id} className="card-dark p-6 hover:bg-white/5 transition-all cursor-pointer flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] font-bold">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-bold text-white">Inquiry for Car #{chat.carId.slice(-4)}</h3>
                              <span className="text-[10px] text-[#8e9299] font-bold uppercase tracking-widest">{new Date(chat.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-[#8e9299] truncate">{chat.lastMessage}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#8e9299]" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="card-dark p-16 text-center border-dashed">
                      <MessageSquare className="w-12 h-12 text-[#8e9299] mx-auto mb-4 opacity-20" />
                      <p className="text-[#8e9299] font-medium">No active conversations.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  variants={fadeInRight}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="card-dark p-8"
                >
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-8">Profile Settings</h2>
                  <div className="space-y-6 max-w-md">
                    <div className="flex items-center gap-6 mb-10">
                      <div className="w-24 h-24 rounded-full bg-white/5 border-4 border-[#121214] shadow-lg overflow-hidden flex items-center justify-center text-3xl text-[#8e9299] font-bold">
                        {auth.currentUser?.photoURL ? <img src={auth.currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" /> : auth.currentUser?.displayName?.[0] || 'U'}
                      </div>
                      <button className="text-xs font-bold text-[#3b82f6] hover:underline uppercase tracking-widest">Change Photo</button>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Display Name</label>
                      <input 
                        type="text" 
                        defaultValue={auth.currentUser?.displayName || ''}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        type="email" 
                        disabled
                        defaultValue={auth.currentUser?.email || ''}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white opacity-40 cursor-not-allowed"
                      />
                    </div>

                    <button className="w-full btn-primary py-4 mt-4">
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'users' && isAdmin && (
                <motion.div
                  key="users"
                  variants={fadeInRight}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-8">User Management</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {allUsers.map((u) => (
                      <div key={u.id} className="card-dark p-6 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl text-[#8e9299] font-bold overflow-hidden">
                            {u.photoURL ? <img src={u.photoURL} alt="" className="w-full h-full object-cover" /> : u.displayName?.[0] || 'U'}
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{u.displayName || 'Anonymous User'}</h3>
                            <p className="text-xs text-[#8e9299]">{u.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${u.role === 'admin' ? 'bg-[#3b82f6]/10 text-[#3b82f6]' : 'bg-white/5 text-[#8e9299]'}`}>
                            {u.role}
                          </span>
                          {u.email !== 'muazz16607@gmail.com' && (
                            <button 
                              onClick={() => handleToggleAdmin(u.id, u.role)}
                              className={`p-2 rounded-xl transition-all ${u.role === 'admin' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6]/20'}`}
                              title={u.role === 'admin' ? 'Revoke Admin' : 'Grant Admin'}
                            >
                              {u.role === 'admin' ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'siteSettings' && isAdmin && (
                <motion.div
                  key="siteSettings"
                  variants={fadeInRight}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="card-dark p-8"
                >
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-8">Site Settings</h2>
                  <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Contact Email</label>
                        <input 
                          type="email" 
                          value={siteSettings.contactEmail}
                          onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                          className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Contact Phone</label>
                        <input 
                          type="text" 
                          value={siteSettings.contactPhone}
                          onChange={(e) => setSiteSettings({...siteSettings, contactPhone: e.target.value})}
                          className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Contact Address</label>
                      <input 
                        type="text" 
                        value={siteSettings.contactAddress}
                        onChange={(e) => setSiteSettings({...siteSettings, contactAddress: e.target.value})}
                        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Facebook URL</label>
                        <input 
                          type="text" 
                          value={siteSettings.facebookUrl}
                          onChange={(e) => setSiteSettings({...siteSettings, facebookUrl: e.target.value})}
                          className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Twitter URL</label>
                        <input 
                          type="text" 
                          value={siteSettings.twitterUrl}
                          onChange={(e) => setSiteSettings({...siteSettings, twitterUrl: e.target.value})}
                          className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest ml-1">Instagram URL</label>
                        <input 
                          type="text" 
                          value={siteSettings.instagramUrl}
                          onChange={(e) => setSiteSettings({...siteSettings, instagramUrl: e.target.value})}
                          className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3b82f6] transition-all"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full btn-primary py-4 mt-4">
                      Save Site Settings
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
