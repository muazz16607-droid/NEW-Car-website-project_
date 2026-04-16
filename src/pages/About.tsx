import { motion } from 'framer-motion';
import { Target, Users, Award, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-[#050505] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 uppercase tracking-wider"
          >
            Redefining the <span className="text-[#3b82f6]">Automotive</span> Experience.
          </motion.h1>
          <p className="text-xl text-[#8e9299] max-w-3xl mx-auto leading-relaxed">
            AutoElite was born from a simple idea: buying and selling a car should be as seamless and premium as the vehicles themselves.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800" 
              alt="Office" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-8">
            <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10">
              <Target className="w-8 h-8 text-[#3b82f6]" />
            </div>
            <h2 className="text-4xl font-bold text-white uppercase tracking-wider">Our Mission</h2>
            <p className="text-[#8e9299] text-lg leading-relaxed">
              We aim to build the world's most trusted and efficient automotive marketplace. By leveraging advanced AI and a commitment to transparency, we empower buyers and sellers to connect with confidence.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-[#3b82f6] mb-1">10k+</p>
                <p className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest opacity-50">Cars Sold</p>
              </div>
              <div>
                <p className="text-4xl font-black text-[#3b82f6] mb-1">99%</p>
                <p className="text-[10px] font-bold text-[#8e9299] uppercase tracking-widest opacity-50">Happy Clients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="card-dark p-12 md:p-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider">Our Core Values</h2>
            <p className="text-[#8e9299]">The principles that drive everything we do.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: ShieldCheck, title: 'Integrity', desc: 'We believe in absolute transparency in every listing and transaction.' },
              { icon: Users, title: 'Community', desc: 'We foster a supportive network of automotive enthusiasts and professionals.' },
              { icon: Award, title: 'Excellence', desc: 'We strive for perfection in our platform, service, and user experience.' }
            ].map((value, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-white/10">
                  <value.icon className="w-8 h-8 text-[#3b82f6]" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-widest text-sm">{value.title}</h3>
                <p className="text-[#8e9299] leading-relaxed text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
