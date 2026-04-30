import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Gavel, Eye, CheckCircle, Sparkles, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const token = localStorage.getItem('museart_token');
      const res = await fetch('/api/gallery/artworks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setArtworks(data);
        } else {
          setArtworks([]);
        }
      } else {
        console.error("Non-JSON response from admin fetch");
        setArtworks([]);
      }
    } catch (err) {
      console.error(err);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (artworkId, newStatus) => {
    try {
      setProcessing((prev) => ({ ...prev, [artworkId]: true }));
      const token = localStorage.getItem('museart_token');
      const res = await fetch(`/api/gallery/admin/artworks/${artworkId}/status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const payload = await res.json();
        setArtworks((prev) => prev.map((a) => ((a.id || a._id) === artworkId ? payload.artwork : a)));
      } else {
        const errorPayload = contentType && contentType.includes("application/json")
          ? await res.json().catch(() => null)
          : null;
        const errorText = errorPayload?.error || await res.text();
        console.error("Status update error:", String(errorText).substring(0, 120));
        alert(errorText || 'Status update failed');
      }
    } catch (err) {
      alert('Status update failed');
    } finally {
      setProcessing((prev) => ({ ...prev, [artworkId]: false }));
    }
  };

  const manageListing = async (artworkId, action) => {
    try {
      setProcessing((prev) => ({ ...prev, [artworkId]: true }));
      const token = localStorage.getItem('museart_token');
      const res = await fetch(`/api/gallery/admin/artworks/${artworkId}/manage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'Listing action failed');
      }
      setArtworks((prev) => prev.map((a) => ((a.id || a._id) === artworkId ? data.artwork : a)));
    } catch (error) {
      alert(error.message || 'Listing action failed');
    } finally {
      setProcessing((prev) => ({ ...prev, [artworkId]: false }));
    }
  };

  const oversightStats = useMemo(() => ({
    total: artworks.length,
    live: artworks.filter((a) => a.status === 'auction').length,
    pending: artworks.filter((a) => (a.moderationStatus || 'pending') === 'pending').length,
    closed: artworks.filter((a) => (a.moderationStatus || 'pending') === 'closed').length
  }), [artworks]);

  return (
    <div className="max-w-7xl mx-auto px-10 pt-44 pb-40">
      <div className="mb-20 flex items-start justify-between border-b border-white/10 pb-16">
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              <p className="text-[11px] uppercase font-black tracking-[1em] text-red-500">ADMINISTRATIVE PROTOCOL</p>
           </div>
           <h2 className="text-8xl font-serif italic text-white leading-none">Market Oversight</h2>
           <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] font-black">Manage global bidding flow and asset availability.</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 px-8 py-6 rounded-3xl text-right">
           <p className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-1">Authenticated Session</p>
           <p className="text-3xl font-serif italic text-white">Administrator Access</p>
        </div>
      </div>

      <div className="space-y-10">
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Total Listings" value={oversightStats.total} />
            <StatCard label="Live Auctions" value={oversightStats.live} />
            <StatCard label="Pending Approval" value={oversightStats.pending} />
            <StatCard label="Closed Listings" value={oversightStats.closed} />
          </div>
        )}
        {loading ? (
           <div className="text-center py-20 animate-pulse text-gold uppercase tracking-widest text-xs">Accessing Encrypted Records...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {artworks.map(artwork => {
                const artworkId = artwork.id || artwork._id;
                return (
                <motion.div 
                  key={artworkId}
                  layout
                  className="bg-[#0a0a0a] border border-white/10 p-10 rounded-[40px] flex flex-col md:flex-row items-center gap-12 group hover:border-gold/30 transition-all"
                >
                  <div className="w-40 h-40 rounded-3xl overflow-hidden shrink-0">
                    <img src={artwork.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>

                  <div className="grow space-y-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-3xl font-serif italic text-white">{artwork.title}</h3>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${artwork.status === 'auction' ? 'bg-red-500/20 text-red-500' : artwork.status === 'sold' ? 'bg-green-500/20 text-green-500' : 'bg-gold/20 text-gold'}`}>
                        {artwork.status}
                      </span>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${(artwork.moderationStatus || 'pending') === 'approved' ? 'bg-green-500/15 text-green-400' : (artwork.moderationStatus || 'pending') === 'closed' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {(artwork.moderationStatus || 'pending')}
                      </span>
                      {artwork.promoted && (
                        <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300">
                          promoted
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 uppercase tracking-widest text-[10px] font-black">By {artwork.artist} • Appraisal: {artwork.aiValuation}</p>
                    <div className="flex items-center gap-6">
                       <div className="space-y-1">
                          <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Current Market Price</p>
                          <p className="text-xl font-serif italic text-white">₹{artwork.currentBid?.toLocaleString() || artwork.startingPrice?.toLocaleString()}</p>
                       </div>
                       <div className="h-8 w-px bg-white/10"></div>
                       <div className="space-y-1">
                          <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Ownership State</p>
                          <p className="text-xl font-serif italic text-gray-400">{artwork.isUserOwned ? 'Acquired' : 'Available'}</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 shrink-0 max-w-[440px] justify-end">
                    <button 
                      onClick={() => updateStatus(artworkId, 'auction')}
                      disabled={processing[artworkId]}
                      className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${artwork.status === 'auction' ? 'bg-gold text-black' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                      <Gavel className="w-4 h-4" /> Go Live
                    </button>
                    <button 
                      onClick={() => updateStatus(artworkId, 'exhibition')}
                      disabled={processing[artworkId]}
                      className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${artwork.status === 'exhibition' ? 'bg-gold text-black' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                      <Eye className="w-4 h-4" /> Exhibit
                    </button>
                    <button 
                      onClick={() => updateStatus(artworkId, 'sold')}
                      disabled={processing[artworkId]}
                      className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${artwork.status === 'sold' ? 'bg-gold text-black' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                      <CheckCircle className="w-4 h-4" /> Mark Sold
                    </button>
                    <button
                      onClick={() => manageListing(artworkId, 'approve')}
                      disabled={processing[artworkId]}
                      className="px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all bg-green-500/15 text-green-300 hover:bg-green-500/25 disabled:opacity-60"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => manageListing(artworkId, 'promote')}
                      disabled={processing[artworkId]}
                      className="px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 disabled:opacity-60"
                    >
                      <Sparkles className="w-4 h-4" /> Promote
                    </button>
                    <button
                      onClick={() => manageListing(artworkId, 'close')}
                      disabled={processing[artworkId]}
                      className="px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-60"
                    >
                      <XCircle className="w-4 h-4" /> Close Listing
                    </button>
                  </div>
                </motion.div>
              )})}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black">{label}</p>
      <p className="text-3xl mt-2 font-serif italic text-white">{value}</p>
    </div>
  );
}
