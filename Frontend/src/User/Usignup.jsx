import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Usignup({ onAuthSuccess, defaultRole = 'collector' }) {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: defaultRole });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const maxRetries = 3;
    let attempt = 0;

    const performSignup = async () => {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Registration failed');
          
          localStorage.setItem('museart_token', data.token);
          localStorage.setItem('museart_user', JSON.stringify(data.user));
          onAuthSuccess(data.user);
        } else {
          const text = await res.text();
          if (text.includes('Starting Server') && attempt < maxRetries) {
            attempt++;
            console.warn(`Backend still warming up (attempt ${attempt}/${maxRetries}). Retrying...`);
            await new Promise(r => setTimeout(r, 2000));
            return performSignup();
          }
          console.error("Non-JSON response:", text.substring(0, 200));
          throw new Error(`Registration service unavailable. This usually means the MONGODB_URI in your Secrets is incorrect or the server is still booting. Verify your connection string.`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    await performSignup();
  };

  return (
    <div className="min-h-screen pt-40 px-10 flex items-center justify-center bg-[#050505]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[40px] p-12 shadow-2xl space-y-10"
      >
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-serif italic text-white gold-gradient">Archive Entry</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black">Establish New Identity</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-black uppercase text-center rounded-xl tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="PROVENANCE NAME"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-[11px] font-black placeholder:text-gray-600 focus:border-gold outline-none transition-all uppercase tracking-widest"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="email" 
              placeholder="IDENTITY@MUSEART.IO"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-[11px] font-black placeholder:text-gray-600 focus:border-gold outline-none transition-all uppercase tracking-widest"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="password" 
              placeholder="ENCRYPTION KEY"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white text-[11px] font-black placeholder:text-gray-600 focus:border-gold outline-none transition-all uppercase tracking-widest"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            {['collector', 'artist', 'admin'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData({...formData, role})}
                className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] border transition-all ${formData.role === role ? 'bg-gold border-gold text-black' : 'bg-transparent border-white/10 text-gray-500'}`}
              >
                {role}
              </button>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold text-black py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold-light transition-all gold-shadow flex items-center justify-center gap-3"
          >
            {loading ? 'Processing...' : 'Register'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('switch-auth', { detail: 'login' }))}
            className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] hover:text-gold transition-colors"
          >
            Already verified? Return to Authenticator
          </button>
        </div>
      </motion.div>
    </div>
  );
}
