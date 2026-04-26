/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Gavel, 
  X, 
  TrendingUp, 
  Palette,
  Sparkles,
  User
} from 'lucide-react';
import Navbar from './Components/Navbar.jsx';
import ArtworkCard from './Components/ArtworkCard.jsx';
// Import login/signup components
import Ulogin from './User/Ulogin.jsx';
import Usignup from './User/Usignup.jsx';
import ArtistDashboard from './Artist/ArtistDashboard.jsx';
import Ahome from './Admin/Ahome.jsx';
import PublicProfile from './User/PublicProfile.jsx';

function Landing({ onSelectRole }) {
  const handleAuthSelect = (mode) => {
    // Dispatch custom event to switch to auth mode
    window.dispatchEvent(new CustomEvent('switch-auth-mode', { detail: mode }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-dark/5 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center space-y-16 z-10"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4">
             <div className="h-px w-12 bg-gold/50"></div>
             <p className="text-gold tracking-[0.6em] text-[10px] font-black uppercase">Identity Verification</p>
             <div className="h-px w-12 bg-gold/50"></div>
          </div>
          <h1 className="text-7xl md:text-8xl font-serif italic gold-gradient py-4">Welcome to MuseArt</h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs font-black">Select your gateway to the digital archive</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Collector Path */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectRole('collector')}
            className="group cursor-pointer p-12 bg-white/5 border border-white/10 rounded-[40px] hover:border-gold/50 transition-all duration-500 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-8">
              <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-gold transition-colors duration-500 shadow-2xl">
                <User className="w-10 h-10 text-gold group-hover:text-black transition-colors duration-500" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-serif italic text-white">The Collector</h2>
                <div className="h-px w-8 bg-gold/30 mx-auto"></div>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-black leading-relaxed">
                  Browse masterpieces, participate in live auctions, and manage your private vault.
                </p>
              </div>
              <div className="pt-4">
                 <span className="text-[10px] text-gold font-black tracking-[0.3em] uppercase group-hover:tracking-[0.5em] transition-all">Enter Archive →</span>
              </div>
            </div>
          </motion.div>

          {/* Artist Path */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectRole('artist')}
            className="group cursor-pointer p-12 bg-white/5 border border-white/10 rounded-[40px] hover:border-gold/50 transition-all duration-500 backdrop-blur-xl relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative space-y-8">
              <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mx-auto group-hover:bg-gold transition-colors duration-500 shadow-2xl">
                <Palette className="w-10 h-10 text-gold group-hover:text-black transition-colors duration-500" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-serif italic text-white">The Creator</h2>
                <div className="h-px w-8 bg-gold/30 mx-auto"></div>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-black leading-relaxed">
                  Lodge new masterpieces into the ledger and manage your neural creative space.
                </p>
              </div>
              <div className="pt-4">
                 <span className="text-[10px] text-gold font-black tracking-[0.3em] uppercase group-hover:tracking-[0.5em] transition-all">Artist Portal →</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Authentication Options */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-black mb-6">Already have an account?</p>
          <div className="flex gap-6 justify-center">
            <button 
              onClick={() => handleAuthSelect('login')}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.3em] hover:border-gold hover:bg-gold/5 transition-all"
            >
              Sign In
            </button>
            <button 
              onClick={() => handleAuthSelect('signup')}
              className="px-8 py-4 bg-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold-light transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const distance = end - now;
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft('EXPIRED');
        return;
      }
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);
  return <span className="font-mono text-gold ml-2">{timeLeft}</span>;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [biddingArtwork, setBiddingArtwork] = useState(null);
  const [resellArtwork, setResellArtwork] = useState(null);
  const [resellPrice, setResellPrice] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isBidding, setIsBidding] = useState(false);
  const [viewState, setViewState] = useState(() => {
    const saved = localStorage.getItem('museart_user');
    return saved ? 'home' : 'landing';
  });
  const [activeFilterId, setActiveFilterId] = useState(null);
  const [allArtworks, setAllArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('museart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState('login');
  const [authRole, setAuthRole] = useState('collector');

  useEffect(() => {
    if (selectedArtwork && allArtworks.length > 0) {
       const updated = allArtworks.find(a => a.id === selectedArtwork.id);
       if (updated && JSON.stringify(updated.bids) !== JSON.stringify(selectedArtwork.bids)) {
          setSelectedArtwork(updated);
       }
    }
  }, [allArtworks]);

  useEffect(() => {
    const handleSwitchAuth = (e) => setAuthMode(e.detail);
    const handleSwitchAuthMode = (e) => {
      setAuthMode(e.detail);
      setViewState('auth');
    };
    const handleSwitchAuthModeWithRole = (e) => {
      setAuthMode(e.detail.mode);
      setAuthRole(e.detail.role);
      setViewState('auth');
    };
    window.addEventListener('switch-auth', handleSwitchAuth);
    window.addEventListener('switch-auth-mode', handleSwitchAuthMode);
    window.addEventListener('switch-auth-mode-with-role', handleSwitchAuthModeWithRole);
    return () => {
      window.removeEventListener('switch-auth', handleSwitchAuth);
      window.removeEventListener('switch-auth-mode', handleSwitchAuthMode);
      window.removeEventListener('switch-auth-mode-with-role', handleSwitchAuthModeWithRole);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchArtworks();
      const interval = setInterval(fetchArtworks, 10000);
      return () => clearInterval(interval);
    }
  }, [viewState, user]);

  const handleLogout = () => {
    localStorage.removeItem('museart_token');
    localStorage.removeItem('museart_user');
    setUser(null);
    setAllArtworks([]);
    setViewState('landing');
  };

  const handleRoleSelection = (role) => {
    window.dispatchEvent(new CustomEvent('switch-auth-mode-with-role', { detail: { mode: 'signup', role } }));
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    // Route based on user role
    if (userData.role === 'artist') {
      setViewState('artist-dashboard');
    } else {
      setViewState('home');
    }
    fetchArtworks();
  };

  const fetchArtworks = async () => {
    try {
      const response = await fetch('/api/gallery/artworks');
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setAllArtworks(data);
        } else {
          console.error("Unexpected data format from /api/gallery/artworks:", data);
          setAllArtworks([]);
        }
      } else {
        console.error("Non-JSON response from /api/gallery/artworks");
        setAllArtworks([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
      setLoading(false);
    }
  };

  const filteredArtworks = useMemo(() => {
    let base = Array.isArray(allArtworks) ? allArtworks : [];
    
    if (viewState === 'vault') {
      return base.filter(a => 
        (a.isUserOwned === true && String(a.ownerId) === String(user?.id || user?._id)) || 
        (a.status === 'auction' && a.auctionEndTime && new Date(a.auctionEndTime).getTime() < Date.now() && String(a.highBidderId) === String(user?.id || user?._id))
      );
    }
    if (viewState === 'artist') {
      return base.filter(a => a.artist === activeFilterId);
    }
    if (viewState === 'style') {
      return base.filter(a => a.styleName === activeFilterId);
    }
    if (viewState === 'masters') {
      return base.filter(a => a.category === 'Classical' && a.status !== 'auction' && !a.isUserOwned);
    }
    if (viewState === 'modern') {
      return base.filter(a => a.category === 'Modern' && a.status !== 'auction' && !a.isUserOwned);
    }
    if (viewState === 'emerging') {
      return base.filter(a => a.category === 'Emerging' && a.status !== 'auction' && !a.isUserOwned);
    }
    if (viewState === 'bidding') {
      return base.filter(a => a.status === 'auction');
    }

    return base.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           a.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, viewState, activeFilterId, allArtworks]);

  const artistProfileArtworks = useMemo(
    () => (Array.isArray(allArtworks) ? allArtworks.filter((a) => a.artist === activeFilterId) : []),
    [allArtworks, activeFilterId]
  );

  const addNotification = (msg) => {
    setNotifications(prev => [msg, ...prev]);
  };

  const handlePlaceBid = (artwork) => {
    const token = localStorage.getItem('museart_token');
    if (!token || token === 'guest_token' || !user) {
      setAuthMode('login');
      setViewState('auth');
      return;
    }
    setBiddingArtwork(artwork);
    setBidAmount((artwork.currentBid + 10000).toString());
  };

  const openArtworkDetail = (artwork) => {
    setSelectedArtwork(artwork);
    setViewState('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitBid = async () => {
    if (!biddingArtwork) return;
    const bid = parseInt(bidAmount);
    if (isNaN(bid) || bid <= biddingArtwork.currentBid) {
       addNotification("Bid must be higher than current valuation.");
       return;
    }

    setIsBidding(true);
    
    try {
      const token = localStorage.getItem('museart_token');
      if (!token || token === 'guest_token') {
        addNotification("Please register to access full transaction capability.");
        setViewState('landing');
        return;
      }

      const response = await fetch('/api/gallery/bid', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ artworkId: biddingArtwork.id, amount: bid })
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        const errorText = (contentType && contentType.includes("application/json")) 
          ? (await response.json()).error 
          : "Bid rejected by server.";
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('museart_token');
          localStorage.removeItem('museart_user');
          setUser(null);
          setViewState('auth');
        }
        throw new Error(errorText);
      }

      await fetchArtworks();
      addNotification(`Your bid of ₹${bid.toLocaleString()} for "${biddingArtwork.title}" was authorized!`);
      setBiddingArtwork(null);
    } catch (error) {
      addNotification(error.message || "Bid rejected.");
    } finally {
      setIsBidding(false);
    }
  };

  const submitResell = async () => {
    if (!resellArtwork) return;
    const price = parseInt(resellPrice);
    if (isNaN(price) || price <= 0) {
       addNotification("Please enter a valid price.");
       return;
    }
    
    try {
      const token = localStorage.getItem('museart_token');
      const response = await fetch('/api/gallery/resell', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ artworkId: resellArtwork.id, price })
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        const errorText = (contentType && contentType.includes("application/json")) 
          ? (await response.json()).error 
          : "Resell request rejected.";
        throw new Error(errorText);
      }

      await fetchArtworks();
      addNotification(`Your asset "${resellArtwork.title}" has been listed on the market for ₹${price.toLocaleString()}!`);
      setResellArtwork(null);
    } catch (error) {
      addNotification(error.message);
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAcquire = async (artwork) => {
    try {
      const token = localStorage.getItem('museart_token');
      if (!token || token === 'guest_token') {
        addNotification("Full asset acquisition requires identity registration.");
        setViewState('landing');
        return;
      }

      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        addNotification("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const price = artwork.status === 'auction' || artwork.status === 'ended' ? artwork.currentBid : artwork.startingPrice;

      // 1. Create order
      const orderRes = await fetch('/api/gallery/create-order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: price })
      });
      if (!orderRes.ok) {
        addNotification("Failed to initialize payment. Try again.");
        return;
      }
      const orderData = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_ShnLMpk5ncTyEX",
        amount: orderData.amount, // amount in paisa
        currency: orderData.currency || "INR",
        name: "MuseArt",
        description: `Acquisition of ${artwork.title}`,
        ...(orderData.id && !orderData.id.startsWith('order_mock_') && { order_id: orderData.id }),
        handler: async function (paymentResponse) {
          try {
            // 2. Verify payment
            const response = await fetch('/api/gallery/verify-payment', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ 
                artworkId: artwork.id,
                razorpay_order_id: paymentResponse.razorpay_order_id || orderData.id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature || "mock_signature"
              })
            });

            if (!response.ok) {
              const contentType = response.headers.get("content-type");
              const errorText = (contentType && contentType.includes("application/json")) 
                ? (await response.json()).error 
                : "Payment verification failed.";
              if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('museart_token');
                localStorage.removeItem('museart_user');
                setUser(null);
                setViewState('auth');
              }
              throw new Error(errorText);
            }

            await fetchArtworks();
            addNotification(`Acquisition successful: "${artwork.title}"`);
            if (selectedArtwork?.id === artwork.id) {
              setSelectedArtwork(null);
              setViewState('home');
            }
          } catch (error) {
            addNotification(error.message || "Acquisition denied.");
          }
        },
        prefill: {
          name: user?.name || "Collector",
          email: user?.email || "collector@example.com",
        },
        theme: {
          color: "#c5a059"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
       addNotification(error.message || "Acquisition denied.");
    }
  };

  const navigateToArtist = (artist) => {
    setActiveFilterId(artist);
    setViewState('artist-profile');
    setSelectedArtwork(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStyle = (style) => {
    setActiveFilterId(style);
    setViewState('style');
    setSelectedArtwork(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans selection:bg-gold/30 bg-[#050505] text-white">
      {/* Show authentication forms when needed */}
      {viewState === 'auth' && (
        <div className="min-h-screen flex items-center justify-center p-6">
          {authMode === 'login' ? (
            <Ulogin onAuthSuccess={handleAuthSuccess} />
          ) : (
            <Usignup onAuthSuccess={handleAuthSuccess} defaultRole={authRole} />
          )}
        </div>
      )}

      {viewState === 'landing' ? (
        <Landing onSelectRole={handleRoleSelection} />
      ) : (
        <>
          <Navbar 
            onSearch={setSearchQuery}
            setViewState={setViewState}
            viewState={viewState}
            user={user}
            onLogout={handleLogout}
          />

          {viewState === 'artist-dashboard' && user?.role === 'artist' && (
            <ArtistDashboard currentUser={user} />
          )}

          {viewState === 'admin-dashboard' && user?.role === 'admin' && (
            <Ahome />
          )}

          {viewState === 'artist-profile' && (
            <PublicProfile
              onReturnHome={() => setViewState('home')}
              artistName={activeFilterId}
              artworks={artistProfileArtworks}
            />
          )}

          {viewState === 'home' && (
        <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-10 overflow-hidden pt-40 pb-20">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gold-dark/5 rounded-full blur-[130px] animate-pulse delay-1000" />
          
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent animate-scanline" />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="z-10 space-y-8 md:space-y-12"
          >
            <div className="flex items-center justify-center gap-6">
              <div className="h-px w-20 bg-gold/30"></div>
              <p className="text-[12px] uppercase font-black tracking-[0.5em] text-gold-light">
                THE GLOBAL ART ARCHIVE
              </p>
              <div className="h-px w-20 bg-gold/30"></div>
            </div>
            
            <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-serif leading-[1] tracking-tighter text-white font-light uppercase py-10 relative">
              THE LEGACY <br/>
              <span className="italic gold-gradient relative">
                OF ART
                <motion.span 
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -inset-4 bg-gold/10 blur-3xl -z-10 rounded-full"
                />
              </span>
            </h1>

            <p className="text-gray-500 max-w-2xl mx-auto uppercase tracking-[0.2em] text-[10px] font-black leading-relaxed">
              Curating the world’s most significant digital masterpieces. <br className="hidden md:block"/> 
              Ownership verified by the neural ledgers of the muse-net.
            </p>
            
            <div className="flex gap-8 justify-center pt-8">
               <button 
                  onClick={() => setViewState('bidding')}
                  className="glass px-12 py-6 rounded-2xl text-[11px] uppercase font-bold tracking-[0.3em] border-white/10 text-white hover:bg-gold hover:text-black transition-all shadow-2xl gold-shadow group"
                >
                 VIEW LIVE AUCTIONS
                 <ArrowRight className="w-4 h-4 inline-block ml-3 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </motion.div>

          <div className="absolute bottom-10 left-0 w-full overflow-hidden opacity-20 border-y border-white/5 py-4 whitespace-nowrap bg-black/40 backdrop-blur-md">
             <div className="flex animate-marquee">
                {Array.from({length: 10}).map((_, i) => (
                  <span key={i} className="text-[10px] uppercase font-black tracking-[0.8em] text-gold mx-20">
                    Neural Verification Active • Secured Assets Only • Provenance Guaranteed • Transcending Physicality
                  </span>
                ))}
             </div>
          </div>
        </header>
      )}

      {/* Sector Specific Headers */}
      {viewState === 'masters' && (
        <header className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-10 overflow-hidden pt-40 pb-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80')] bg-fixed bg-cover bg-center opacity-10 grayscale scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
          
          <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="z-10 space-y-12">
            <div className="flex items-center justify-center gap-6">
              <div className="h-px w-20 bg-gold/50"></div>
              <p className="text-[12px] uppercase font-black tracking-[0.5em] text-gold">CENTURIES OF EXCELLENCE</p>
              <div className="h-px w-20 bg-gold/50"></div>
            </div>
            
            <h1 className="text-8xl md:text-[12rem] font-serif leading-[0.8] tracking-tighter text-white font-light uppercase py-10">
              THE <span className="italic gold-gradient">MASTERS</span>
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto uppercase tracking-[0.2em] text-[10px] font-black leading-relaxed">
              Curating pre-neural era masterpieces. <br/>
              A testament to human handcraft and physical permanence.
            </p>
          </motion.div>
        </header>
      )}

      {viewState === 'modern' && (
        <header className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-10 overflow-hidden pt-40 pb-20 bg-[#080808]">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-white animate-scanline" />
             <div className="grid grid-cols-12 h-full gap-px bg-white/10">
                {Array.from({length: 12}).map((_, i) => <div key={i} className="border-r border-white/5 h-full" />)}
             </div>
          </div>
          
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="z-10 space-y-12">
            <p className="text-[12px] uppercase font-black tracking-[1em] text-gold flex items-center justify-center gap-4">
              <TrendingUp className="w-4 h-4" /> THE MID-NEURAL SHIFT
            </p>
            
            <h1 className="text-8xl md:text-[12rem] font-serif leading-[0.8] tracking-tighter text-white font-light uppercase py-10">
              ULTRA <span className="italic gold-gradient">MODERN</span>
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto uppercase tracking-[0.2em] text-[10px] font-black leading-relaxed">
              Where synthesis meets reality. <br/>
              The era of the algorithmic vanguard.
            </p>
          </motion.div>
        </header>
      )}

      {viewState === 'emerging' && (
        <header className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-10 overflow-hidden pt-40 pb-20 bg-gradient-to-br from-[#050505] to-[#0a0f0a]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[150px] animate-pulse" />
          
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="z-10 space-y-12">
             <div className="inline-block px-4 py-2 border border-gold/30 rounded-full bg-gold/5 backdrop-blur-md">
                <p className="text-[10px] uppercase font-black tracking-[0.3em] text-gold">NEXT GENERATION SECTOR</p>
             </div>
            
            <h1 className="text-8xl md:text-[12rem] font-serif leading-[0.8] tracking-tighter text-white font-light uppercase py-10">
              NEW <span className="italic gold-gradient">FUTURES</span>
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto uppercase tracking-[0.2em] text-[10px] font-black leading-relaxed">
              The neural-native frontier. <br/>
              Artworks generated in the last 24 nanoseconds.
            </p>
          </motion.div>
        </header>
      )}

      {viewState === 'bidding' && (
        <header className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-10 overflow-hidden pt-40 pb-20 bg-[#050505]">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:40px_40px]" />
          </div>
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1000&q=80"
              alt="auction painting backdrop"
              className="absolute top-16 left-8 w-44 h-56 md:w-56 md:h-72 object-cover rounded-3xl border border-white/20 opacity-25 rotate-[-8deg]"
              referrerPolicy="no-referrer"
            />
            <img
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=80"
              alt="auction painting backdrop"
              className="absolute bottom-20 left-20 w-40 h-52 md:w-52 md:h-64 object-cover rounded-3xl border border-white/20 opacity-20 rotate-[6deg]"
              referrerPolicy="no-referrer"
            />
            <img
              src="https://images.unsplash.com/photo-1577083552431-6e5fd01988f1?auto=format&fit=crop&w=1000&q=80"
              alt="auction painting backdrop"
              className="absolute top-24 right-10 w-44 h-56 md:w-56 md:h-72 object-cover rounded-3xl border border-white/20 opacity-25 rotate-[8deg]"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-10 space-y-12">
            <div className="flex items-center justify-center gap-4 text-red-500">
               <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <p className="text-[12px] uppercase font-black tracking-[0.5em]">LIVE AUCTION PROTOCOL ACTIVE</p>
            </div>
            
            <h1 className="text-8xl md:text-[12rem] font-serif leading-[0.8] tracking-tighter text-white font-light uppercase py-10">
              THE <span className="italic gold-gradient">EXCHANGE</span>
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto uppercase tracking-[0.2em] text-[10px] font-black leading-relaxed">
              Real-time asset acquisition. <br/>
              High-frequency aesthetic trading in progress.
            </p>
          </motion.div>
        </header>
      )}

      {(viewState === 'home' || viewState === 'masters' || viewState === 'modern' || viewState === 'emerging' || viewState === 'bidding' || viewState === 'artist' || viewState === 'style') && (
        <main className="max-w-[1400px] mx-auto px-10 py-32 pb-60 relative z-10">
          {(viewState === 'artist' || viewState === 'style') && (
            <div className="mb-24 space-y-6 pt-20">
               <div className="flex items-center gap-4">
                  <div className="h-px w-8 bg-gold"></div>
                  <p className="text-[11px] uppercase font-black tracking-[0.5em] text-gold">COLLECTION SEGMENT</p>
               </div>
               <h2 className="text-8xl md:text-9xl font-serif italic text-white gold-gradient w-fit">{activeFilterId}</h2>
               <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] font-black">Archive sector verified for public inspection</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            <AnimatePresence mode="popLayout">
              {filteredArtworks.map((artwork, idx) => (
                <motion.div
                  key={artwork.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <ArtworkCard 
                    artwork={artwork} 
                    onOpenDetails={openArtworkDetail}
                    onPlaceBid={handlePlaceBid}
                    onAcquire={handleAcquire}
                    onArtistClick={navigateToArtist}
                    onStyleClick={navigateToStyle}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredArtworks.length === 0 && (
            <div className="text-center py-60 bg-white/5 rounded-[60px] border border-white/5">
              <Palette className="w-24 h-24 text-white/10 mx-auto mb-10" />
              <h3 className="text-4xl font-serif italic mb-6">Awaiting Curatorial Presence</h3>
              <p className="text-gray-500 uppercase tracking-[0.4em] text-[12px] font-black">No matching records found in this sector</p>
            </div>
          )}
        </main>
      )}

      {viewState === 'detail' && selectedArtwork && (
        <div className="relative min-h-screen pt-32 pb-40 px-6 md:px-10 max-w-[1500px] mx-auto overflow-hidden">
           {/* Atmospheric Detail Background */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-10" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold-dark/5 rounded-full blur-[150px] -z-10" />

           <button 
              onClick={() => setViewState('home')}
              className="text-gold text-[11px] uppercase font-black tracking-[0.4em] flex items-center gap-3 mb-16 group hover:translate-x-[-10px] transition-all"
            >
              <ArrowRight className="w-5 h-5 rotate-180 group-hover:text-white" /> Return to Archives
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
               <div className="perspective-2000 h-[700px] w-full">
                  <motion.div 
                    onClick={(e) => {
                      const el = e.currentTarget;
                      const flipped = el.getAttribute('data-flipped') === 'true';
                      el.setAttribute('data-flipped', String(!flipped));
                      el.style.transform = flipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
                    }}
                    className="relative w-full h-full preserve-3d transition-transform duration-1000 cursor-pointer shadow-2xl"
                  >
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-[40px] overflow-hidden border border-white/10">
                       <img src={selectedArtwork.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#0e0e0e] rounded-[40px] p-16 flex flex-col border border-gold/20">
                        <div className="mb-10 text-gold uppercase text-[11px] font-black tracking-[0.5em] border-b border-white/5 pb-6">Curator's Narrative</div>
                        <p className="text-xl leading-relaxed text-gray-300 font-serif italic flex-grow overflow-y-auto custom-scrollbar pr-4">
                          {selectedArtwork.description}
                        </p>
                    </div>
                  </motion.div>
               </div>

               <div className="space-y-16 py-10">
                  <div className="space-y-6">
                    <h1 className="text-8xl md:text-9xl font-serif italic gold-gradient leading-tight">{selectedArtwork.title}</h1>
                    <p className="text-4xl font-light tracking-wide text-white">{selectedArtwork.artist}</p>
                  </div>

                  <div className="p-12 bg-white/5 border border-white/10 rounded-[40px] space-y-12 backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Palette className="w-20 h-20" />
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500">Asset Valuation</p>
                        <div className="flex items-baseline gap-4">
                          <p className="text-6xl font-serif italic text-white">
                            {selectedArtwork.status === 'auction' 
                              ? `₹${selectedArtwork.currentBid.toLocaleString()}` 
                              : selectedArtwork.status === 'sold'
                                ? `₹${selectedArtwork.purchasePrice?.toLocaleString() || selectedArtwork.startingPrice.toLocaleString()}`
                                : `₹${selectedArtwork.startingPrice.toLocaleString()}`}
                          </p>
                          <span className="text-[10px] text-gold font-black uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full text-center">
                            {selectedArtwork.status === 'auction' ? 'Current High' : 'Acquisition Fixed'}
                          </span>
                        </div>
                        {selectedArtwork.status === 'auction' && (() => {
                          const isEnded = selectedArtwork.auctionEndTime && new Date(selectedArtwork.auctionEndTime).getTime() < Date.now();
                          return (
                            <>
                              <div className="flex items-center gap-2 mt-2">
                                 <div className={`w-2 h-2 rounded-full ${isEnded ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                                 <p className={`text-[9px] font-black tracking-widest uppercase ${isEnded ? 'text-red-500' : 'text-green-500'}`}>
                                   {isEnded ? 'Auction Concluded' : 'Live Market Active'}
                                 </p>
                                 {!isEnded && selectedArtwork.auctionEndTime && (
                                   <CountdownTimer endTime={selectedArtwork.auctionEndTime} />
                                 )}
                              </div>

                              {selectedArtwork.bids && selectedArtwork.bids.length > 0 && (
                                <div className="mt-6 border-t border-white/10 pt-6">
                                  <p className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500 mb-4">Bidding Ledger</p>
                                  <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                    {selectedArtwork.bids.slice().reverse().map((bid, i) => (
                                      <div key={i} className="flex justify-between items-center text-xs p-3 bg-black/20 rounded-xl border border-white/5">
                                        <span className="text-gray-300 font-medium">{bid.bidderName}</span>
                                        <span className="text-gold font-semibold">₹{bid.amount.toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>

                      <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
                         <div>
                            <p className="text-[9px] uppercase text-gray-500 font-black tracking-widest mb-2">Estimated Appraisal</p>
                            <p className="text-xl font-serif italic text-white">{selectedArtwork.aiValuation}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] uppercase text-gray-500 font-black tracking-widest mb-2">Status</p>
                            <p className="text-xl uppercase font-black tracking-tighter text-gold">{selectedArtwork.status}</p>
                         </div>
                      </div>

                      {(() => {
                        const isAuctionEnded = selectedArtwork.status === 'auction' && selectedArtwork.auctionEndTime && new Date(selectedArtwork.auctionEndTime).getTime() < Date.now();
                        const isWinner = isAuctionEnded && String(selectedArtwork.highBidderId) === String(user?.id || user?._id);

                        let btnText = 'Direct Acquisition';
                        let btnAction = () => handleAcquire(selectedArtwork);
                        let isDisabled = false;

                        if (selectedArtwork.status === 'sold') {
                           btnText = 'Asset Fully Acquired';
                           isDisabled = true;
                        } else if (isAuctionEnded) {
                           if (isWinner) {
                              btnText = 'Pay Winning Bid';
                           } else {
                              btnText = 'Auction Ended';
                              isDisabled = true;
                           }
                        } else if (selectedArtwork.status === 'auction') {
                           btnText = 'Authorize Acquisition Bid';
                           btnAction = () => handlePlaceBid(selectedArtwork);
                        }

                        return (
                          <button 
                            onClick={btnAction}
                            className={`w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all gold-shadow active:scale-[0.98] ${isDisabled ? 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5' : 'bg-gold text-black hover:bg-gold-light'}`}
                            disabled={isDisabled}
                          >
                            {btnText}
                          </button>
                        );
                      })()}

                      {selectedArtwork.status === 'sold' && (
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">This masterpiece is held in a private vault.</p>
                        </div>
                      )}
                   </div>
               </div>
            </div>
        </div>
      )}

      {viewState === 'vault' && (
        <section className="max-w-7xl mx-auto px-10 pt-44 pb-40">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/10 pb-16">
            <div className="space-y-4">
               <p className="text-[11px] uppercase font-black tracking-[1em] text-gold">GLOBAL PORTFOLIO</p>
               <h2 className="text-8xl md:text-9xl font-serif italic text-white leading-none">The Private Vault</h2>
            </div>
            <div className="bg-[#111] border border-white/10 p-8 rounded-[32px] flex items-center gap-10">
               <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Total Assets</p>
                  <p className="text-3xl font-serif italic text-white">{filteredArtworks.length}</p>
               </div>
               <div className="h-12 w-px bg-white/10"></div>
               <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Net Portfolio Value</p>
                  <p className="text-3xl font-serif italic text-gold">₹{filteredArtworks.reduce((acc, a) => acc + (a.currentMarketValue || 0), 0).toLocaleString()}</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-16">
            {filteredArtworks.map(a => {
               const pPrice = a.purchasePrice || a.startingPrice || 0;
               const cmValue = a.currentMarketValue || pPrice || 0;
               const valueChange = cmValue - pPrice;
               const percentChange = pPrice > 0 ? (valueChange / pPrice) * 100 : 0;
               const isProfit = valueChange >= 0;

               return (
                <motion.div 
                  key={a.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0a0a0a] border border-white/10 rounded-[44px] overflow-hidden group flex flex-col md:flex-row shadow-2xl hover:border-gold/30 transition-all duration-500"
                >
                  <div className="w-full md:w-[300px] h-[350px] relative shrink-0">
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 py-2 px-4 bg-gold text-black text-[9px] font-black uppercase tracking-[0.4em] rounded-lg">VERIFIED OWNER</div>
                  </div>

                  <div className="p-10 flex flex-col justify-between flex-grow">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-4xl font-serif italic text-white mb-2 leading-tight group-hover:text-gold transition-colors">{a.title}</h3>
                        <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-black">{a.artist}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                        <div className="space-y-2">
                           <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Entry Price</p>
                           <p className="text-2xl font-serif italic text-white">₹{pPrice.toLocaleString()}</p>
                        </div>
                        <div className="space-y-2 text-right">
                           <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Market Appraisal</p>
                           <p className="text-2xl font-serif italic text-gold">₹{cmValue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 flex flex-col gap-4">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isProfit ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                               {isProfit ? <TrendingUp className="w-6 h-6" /> : <TrendingUp className="w-6 h-6 rotate-180" />}
                            </div>
                            <div>
                               <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Performance</p>
                               <p className={`text-xl font-serif italic ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                                {isProfit ? '+' : ''}{percentChange.toFixed(2)}% (₹{Math.abs(valueChange).toLocaleString()})
                               </p>
                            </div>
                         </div>
                         <div 
                          onClick={() => openArtworkDetail(a)}
                          className="w-14 h-14 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer shrink-0"
                         >
                           <ArrowRight className="w-6 h-6" />
                         </div>
                       </div>
                       
                       {a.isUserOwned ? (
                         <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-2">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-6">Delivery Status: <span className="text-gold capitalize">{a.deliveryStatus?.replace('_', ' ') || 'Processing'}</span></p>
                            
                            <div className="relative flex items-center justify-between w-full px-2">
                               {/* Connecting lines */}
                               <div className="absolute left-2 right-2 top-2 -translate-y-1/2 h-1 bg-white/10 rounded-full z-0">
                                  {(() => {
                                     const statusMap = { 'processing': 0, 'shipped': 33, 'out_for_delivery': 66, 'delivered': 100 };
                                     const p = statusMap[a.deliveryStatus?.toLowerCase()] ?? 0;
                                     return <div className="h-full bg-gold transition-all duration-1000" style={{ width: `${p}%` }} />
                                  })()}
                               </div>
                               
                               {/* Dots */}
                               {['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                                  const statusMap = { 'processing': 0, 'shipped': 1, 'out_for_delivery': 2, 'delivered': 3 };
                                  const currentStep = statusMap[a.deliveryStatus?.toLowerCase()] ?? 0;
                                  const isCompleted = currentStep >= idx;
                                  return (
                                     <div key={idx} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-4 h-4 rounded-full border-2 transition-colors duration-500 ${isCompleted ? 'bg-gold border-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]' : 'bg-[#1a1a1a] border-white/20'}`} />
                                        <span className={`absolute top-6 text-[7px] uppercase tracking-wider font-bold text-center w-16 -ml-8 left-1/2 ${isCompleted ? 'text-gold' : 'text-gray-600'}`}>{step}</span>
                                     </div>
                                  );
                               })}
                            </div>
                            <div className="h-4" /> {/* Spacer for the text */}
                             
                             <button 
                               onClick={() => { setResellArtwork(a); setResellPrice(cmValue.toString()); }}
                               className="w-full mt-4 bg-transparent border border-gold/50 text-gold py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold/10 transition-all"
                             >
                               Resell Asset on Market
                             </button>
                          </div>
                        ) : (
                         <button 
                           onClick={() => handleAcquire(a)}
                           className="w-full mt-2 bg-gold text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-light transition-all"
                         >
                           Pay Winning Bid (₹{pPrice.toLocaleString()})
                         </button>
                       )}
                    </div>
                  </div>
                </motion.div>
               );
            })}
          </div>

          {filteredArtworks.length === 0 && (
             <div className="text-center py-40 border border-white/5 rounded-[60px] bg-white/5">
                <Sparkles className="w-20 h-20 text-gold/20 mx-auto mb-8" />
                <h3 className="text-3xl font-serif italic mb-4">The Archive is Currently Empty</h3>
                <p className="text-gray-500 uppercase tracking-[0.3em] font-black text-xs mb-8 whitespace-nowrap overflow-hidden">No neural assets verified under your signature</p>
                <button 
                  onClick={() => setViewState('home')}
                  className="bg-gold text-black px-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gold-light transition-all"
                >
                  Return to Market
                </button>
             </div>
          )}
        </section>
      )}

      <AnimatePresence>
        {biddingArtwork && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-onyx/90 backdrop-blur-2xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-lg bg-[#0e0e0e] border border-gold/30 rounded-[40px] p-10">
              <Gavel className="w-12 h-12 text-gold mx-auto mb-6" />
              <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="w-full bg-white/5 border p-8 text-4xl font-serif text-white rounded-2xl mb-8" />
              <button onClick={submitBid} className="w-full bg-white text-black py-6 rounded-2xl uppercase font-black tracking-widest">Authorize Transaction</button>
              <button onClick={() => setBiddingArtwork(null)} className="w-full mt-4 text-gray-500 uppercase text-[10px]">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resellArtwork && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-onyx/90 backdrop-blur-2xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-lg bg-[#0e0e0e] border border-gold/30 rounded-[40px] p-10 text-center">
              <h3 className="text-2xl font-serif italic text-white mb-2">Resell Asset</h3>
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-6">List back on the public market</p>
              <div className="relative">
                 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-gray-400">₹</span>
                 <input type="number" value={resellPrice} onChange={(e) => setResellPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 p-8 pl-14 text-4xl font-serif text-white rounded-2xl mb-8 focus:border-gold outline-none" />
              </div>
              <button onClick={submitResell} className="w-full bg-gold text-black py-6 rounded-2xl uppercase font-black tracking-widest hover:bg-gold-light transition-all">List Asset</button>
              <button onClick={() => setResellArtwork(null)} className="w-full mt-4 text-gray-500 uppercase text-[10px] hover:text-white transition-colors">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 right-8 z-[150] space-y-4">
         <AnimatePresence>
           {notifications.map((n, i) => (
             <motion.div key={i} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} className="glass-gold border-gold/50 p-6 rounded-2xl shadow-2xl flex items-center gap-4">
               <Sparkles className="text-gold" />
               <p className="text-xs text-white">{n}</p>
               <X className="w-4 h-4 ml-auto cursor-pointer opacity-30" onClick={() => setNotifications(prev => prev.filter((_, idx) => idx !== i))} />
             </motion.div>
           ))}
         </AnimatePresence>
      </div>
        </>
      )}
    </div>
  );
}
