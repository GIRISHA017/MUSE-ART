import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, DollarSign, Palette, FileText, Layout, Sparkles, Send } from 'lucide-react';

export default function ArtistDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    startingPrice: '',
    category: 'Classical',
    styleName: '',
    styleDescription: '',
    status: 'exhibition'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem('museart_token');
      const res = await fetch('/api/gallery/artist/artwork', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          startingPrice: Number(formData.startingPrice),
          aiValuation: `₹${(formData.startingPrice * 1.2).toLocaleString()} - ₹${(formData.startingPrice * 1.5).toLocaleString()}`
        })
      });

      if (!res.ok) throw new Error('Submission failed');
      
      setSuccess(true);
      setFormData({
        title: '', description: '', image: '', startingPrice: '',
        category: 'Classical', styleName: '', styleDescription: '', status: 'exhibition'
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-10 pt-44 pb-40">
      <div className="mb-20 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-px w-10 bg-gold"></div>
          <p className="text-[11px] uppercase font-black tracking-[1em] text-gold">ARTIST SECTOR</p>
        </div>
        <h2 className="text-8xl font-serif italic text-white leading-none">Submit Masterpiece</h2>
        <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] font-black">Register new assets for global distribution and valuation.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-10 bg-[#0a0a0a] p-12 border border-white/10 rounded-[44px]">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest pl-2">Artwork Title</label>
              <div className="relative">
                <Palette className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                <input 
                  type="text" required value={formData.title}
                  placeholder="e.g. THE NOCTURNAL SYMPHONY"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-[11px] font-black placeholder:text-gray-600 focus:border-gold outline-none transition-all uppercase tracking-widest"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-4">
                  <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest pl-2">Initial Appraisal</label>
                  <div className="relative">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                    <input 
                      type="number" required value={formData.startingPrice}
                      placeholder="500000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-[11px] font-black placeholder:text-gray-600 focus:border-gold outline-none transition-all uppercase tracking-widest"
                      onChange={(e) => setFormData({...formData, startingPrice: e.target.value})}
                    />
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest pl-2">Archive Path (Category)</label>
                  <select 
                    value={formData.category}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white text-[11px] font-black focus:border-gold outline-none transition-all appearance-none cursor-pointer uppercase tracking-widest"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Classical">Classical</option>
                    <option value="Modern">Modern</option>
                    <option value="Emerging">Emerging</option>
                  </select>
               </div>
            </div>

             <div className="space-y-4">
              <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest pl-2">Asset URL (Unsplash/Imgur)</label>
              <div className="relative">
                <Layout className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                <input 
                  type="text" required value={formData.image}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-[11px] font-black placeholder:text-gray-600 focus:border-gold outline-none transition-all tracking-widest"
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest pl-2">Listing Protocol</label>
              <div className="flex gap-4">
                 {['exhibition', 'auction'].map(s => (
                   <button
                    key={s} type="button"
                    onClick={() => setFormData({...formData, status: s})}
                    className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.status === s ? 'bg-gold border-gold text-black' : 'bg-transparent border-white/10 text-gray-500'}`}
                   >
                     {s}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10 flex flex-col">
          <div className="space-y-10 bg-[#0a0a0a] p-12 border border-white/10 rounded-[44px] flex-grow">
             <div className="space-y-4">
              <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest pl-2">Style Classification</label>
              <div className="relative">
                <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                <input 
                  type="text" required value={formData.styleName}
                  placeholder="e.g. NEO-LUMINISM"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-[11px] font-black placeholder:text-gray-600 focus:border-gold outline-none transition-all uppercase tracking-widest"
                  onChange={(e) => setFormData({...formData, styleName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest pl-2">Curatory Statement</label>
              <div className="relative">
                <FileText className="absolute left-6 top-8 w-5 h-5 text-gold/50" />
                <textarea 
                  required rows="6" value={formData.description}
                  placeholder="Describe the neural and physical resonance of this asset..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-white text-[11px] font-black placeholder:text-gray-600 focus:border-gold outline-none transition-all uppercase tracking-widest resize-none"
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-gold text-black py-8 rounded-[32px] text-[12px] font-black uppercase tracking-[0.5em] hover:bg-gold-light transition-all gold-shadow group flex items-center justify-center gap-6"
          >
            {loading ? 'Transmitting Data...' : (success ? 'Asset Verified' : 'Submit to Registry')} <Send className={`w-6 h-6 transition-transform ${success ? 'scale-125 text-white' : 'group-hover:translate-x-2'}`} />
          </button>
        </div>
      </form>
    </div>
  );
}
