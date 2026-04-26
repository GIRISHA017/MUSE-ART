import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Gavel, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Share2, 
  Heart,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

const ARTWORKS = [
  {
    id: 1,
    title: "Celestial Architecture",
    image: "https://picsum.photos/seed/nebula/800/1000",
    currentBid: 520000,
    endTime: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    bids: 12
  },
  {
    id: 2,
    title: "Neural Synapse #42",
    image: "https://picsum.photos/seed/cyber/800/1000",
    currentBid: 285000,
    endTime: Date.now() + 1000 * 60 * 60 * 6, // 6 hours
    bids: 8
  },
  {
    id: 3,
    title: "Quantum Horizon",
    image: "https://picsum.photos/seed/horizon/800/1000",
    currentBid: 1450000,
    endTime: Date.now() + 1000 * 60 * 60 * 48, // 48 hours
    bids: 45
  },
  {
    id: 4,
    title: "Digital Ghost",
    image: "https://picsum.photos/seed/ghost/800/1000",
    currentBid: 120000,
    endTime: Date.now() + 1000 * 60 * 30, // 30 mins
    bids: 4
  }
];

export default function ArtistProfile({ onReturnHome }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const updatedTime = {};
      ARTWORKS.forEach(art => {
        const diff = art.endTime - now;
        if (diff > 0) {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          updatedTime[art.id] = `${h}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
        } else {
          updatedTime[art.id] = "EXPIRED";
        }
      });
      setTimeLeft(updatedTime);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-onyx text-white overflow-hidden selection:bg-gold/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gold/5 blur-[150px] rounded-full animate-slow-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold-dark/5 blur-[120px] rounded-full animate-slow-pulse delay-1000" />
        <div className="absolute inset-0 noise-bg" />
      </div>

      <main className="relative z-10 pt-32 pb-40 px-6 max-w-7xl mx-auto">
        {/* Navigation / Return */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onReturnHome}
          className="flex items-center gap-4 text-slate-blue hover:text-white transition-colors mb-20 group"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/5 transition-all">
            <ArrowRight className="w-4 h-4 rotate-180" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Market Access Protocol</span>
        </motion.button>

        {/* Hero Section */}
        <section className="text-center space-y-12 mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="h-px w-12 bg-gold/30" />
              <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-blue">
                NEURAL ARTIST • EPOCH IV
              </p>
              <div className="h-px w-12 bg-gold/30" />
            </div>
            <h1 className="text-7xl md:text-9xl font-serif gold-gradient leading-none tracking-tighter pb-4">
              ELARA <br className="md:hidden" /> NEXUS
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="relative group">
              {/* Profile Image with Luxury Glow */}
              <div className="absolute -inset-4 bg-gold/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative w-48 h-64 md:w-56 md:h-72 luxury-glass p-2 border border-gold/30 gold-shadow-glow">
                <img 
                  src="https://picsum.photos/seed/artist/600/800" 
                  alt="Artist Portrait" 
                  className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 right-[-20px] bg-gold text-black p-4 luxury-shadow shadow-2xl">
                   <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>

            <p className="text-slate-blue max-w-lg mx-auto text-[13px] leading-relaxed tracking-wide font-light">
              Synthesizing quantum aesthetics with neural-native forms. Exploring the boundary between carbon memory 
              and algorithmic foresight.
            </p>
          </motion.div>
        </section>

        {/* Global Stats / Profile Card */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
           {[
             { label: "ASSET VALUATION", value: "₹4.8M", icon: TrendingUp },
             { label: "NEURAL SIGNATURES", value: "152", icon: ShieldCheck },
             { label: "MARKET RANK", value: "MASTER", icon: Gavel }
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 + (i * 0.1) }}
               className="luxury-glass p-10 flex flex-col items-center text-center group hover:border-gold/30 transition-all cursor-crosshair"
             >
                <div className="w-12 h-12 rounded-full bg-gold/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <stat.icon className="w-5 h-5 text-gold-light" />
                </div>
                <p className="text-[10px] font-black text-slate-blue tracking-[0.4em] mb-2 uppercase">{stat.label}</p>
                <p className="text-3xl font-serif italic text-white">{stat.value}</p>
             </motion.div>
           ))}
        </section>

        {/* Gallery Grid */}
        <section className="space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="h-px w-8 bg-gold" />
                   <span className="text-[10px] font-black text-gold uppercase tracking-[0.6em]">ACTIVE CHRONICLES</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-serif italic text-white tracking-tight">Public Archives</h2>
             </div>
             <div className="flex gap-4">
                 <div className="px-6 py-3 border border-white/10 rounded-full text-[10px] font-black text-slate-blue hover:text-white transition-colors cursor-pointer uppercase tracking-widest">Digital Painting</div>
                 <div className="px-6 py-3 border border-white/10 rounded-full text-[10px] font-black text-slate-blue hover:text-white transition-colors cursor-pointer uppercase tracking-widest">Neural Sculpting</div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {ARTWORKS.map((art, idx) => (
              <motion.div 
                key={art.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] luxury-glass border border-white/5 group-hover:border-gold/30 transition-all duration-700">
                  <img 
                    src={art.image} 
                    alt={art.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Timer Card */}
                  <div className="absolute top-8 right-8 luxury-glass px-6 py-3 border border-gold/20 flex items-center gap-3">
                     <Clock className="w-3 h-3 text-gold animate-pulse" />
                     <span className="text-[11px] font-mono font-bold tracking-widest text-white">{timeLeft[art.id] || "00:00:00"}</span>
                  </div>

                  {/* Artwork Detail Overlay */}
                  <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                     <div className="space-y-2">
                        <h3 className="text-3xl font-serif italic text-white group-hover:text-gold transition-colors">{art.title}</h3>
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black text-slate-blue tracking-[0.3em] uppercase">Current Valuation</span>
                           <span className="text-[14px] font-serif italic text-gold">₹{art.currentBid.toLocaleString()}</span>
                        </div>
                     </div>
                     <motion.button 
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.9 }}
                       className="w-14 h-14 rounded-full bg-gold flex items-center justify-center text-black shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                     >
                        <Gavel className="w-5 h-5" />
                     </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact/Bid Interface Section */}
        <section className="mt-60 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
               <div className="space-y-6">
                 <h2 className="text-5xl md:text-6xl font-serif gold-gradient leading-tight italic">Direct Neural <br/> Negotiation</h2>
                 <p className="text-slate-blue uppercase text-[10px] font-black tracking-[0.5em]">Reserved for private collection inquiries</p>
               </div>

               <div className="space-y-6 max-w-md">
                   <div className="relative group">
                      <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-blue group-focus-within:text-gold transition-colors" />
                      <input 
                        className="w-full input-luxury pl-16 focus:border-gold/50" 
                        placeholder="MESSAGE ARCHITECT"
                      />
                   </div>
                   <div className="relative group">
                       <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-blue group-focus-within:text-gold transition-colors" />
                       <input 
                        className="w-full input-luxury pl-16 focus:border-gold/50" 
                        placeholder="COLLECTOR SIGNATURE"
                       />
                   </div>
                   <button className="w-full py-6 bg-gold text-black font-black uppercase tracking-[0.5em] text-[11px] rounded-2xl hover:bg-gold-light transition-all gold-shadow-glow">
                      AUTHORIZE REQUEST
                   </button>
               </div>
            </div>

            <div className="relative">
                <div className="aspect-square relative flex items-center justify-center">
                    {/* Futuristic Compass/Circle Decoration */}
                    <div className="absolute inset-0 border border-gold/10 rounded-full animate-spin-slow" />
                    <div className="absolute inset-4 border border-gold/5 rounded-full animate-reverse-spin" />
                    <div className="absolute inset-20 luxury-glass flex flex-col items-center justify-center p-12 text-center rounded-full border border-gold/30 gold-shadow-glow">
                       <MapPin className="w-8 h-8 text-gold mb-6" />
                       <p className="text-[10px] font-black text-slate-blue tracking-[0.4em] mb-2 uppercase">Current Sector</p>
                       <p className="text-2xl font-serif italic text-white">NEO-KYOTO • HIVE 07</p>
                       <div className="flex gap-6 mt-10">
                          <Share2 className="w-5 h-5 text-slate-blue hover:text-gold cursor-pointer" />
                          <Heart className="w-5 h-5 text-slate-blue hover:text-red-500 cursor-pointer" />
                       </div>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="relative z-10 py-20 px-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-slate-blue uppercase text-[9px] font-black tracking-[0.6em]">
         <p>© MUSEART NEURAL ARCHIVE 2026</p>
         <div className="flex gap-10 mt-8 md:mt-0">
            <span className="hover:text-gold cursor-pointer">TERMINALS</span>
            <span className="hover:text-gold cursor-pointer">PROTOCOLS</span>
            <span className="hover:text-gold cursor-pointer">PRIVACY ENCRYPTION</span>
         </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-reverse-spin { animation: reverse-spin 15s linear infinite; }
      `}} />
    </div>
  );
}
