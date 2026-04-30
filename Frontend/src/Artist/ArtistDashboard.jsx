import React, { useEffect, useMemo, useState } from 'react';
import { Bot, Sparkles, Upload, Radio, BarChart3 } from 'lucide-react';

const DEFAULT_AUCTION_ITEMS = [
  { id: 'a1', title: 'Midnight Echo', highestBidder: 'Ananya R.', endsIn: '02h 14m' },
  { id: 'a2', title: 'Crimson Drift', highestBidder: 'Rahul K.', endsIn: '11h 03m' }
];

const DEFAULT_SALES = [
  { month: 'Jan', value: 8000 },
  { month: 'Feb', value: 12000 },
  { month: 'Mar', value: 18000 },
  { month: 'Apr', value: 24000 },
  { month: 'May', value: 30000 }
];

const WING_IMAGES = {
  Master: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=900&q=80',
  Modern: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=900&q=80',
  Emerging: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=80'
};

const DEFAULT_WING_PERFORMANCE = [
  { wing: 'Master', count: 3, image: WING_IMAGES.Master },
  { wing: 'Modern', count: 6, image: WING_IMAGES.Modern },
  { wing: 'Emerging', count: 8, image: WING_IMAGES.Emerging }
];

const PROMOTION_THRESHOLD = 15000;
const getEffectivePrice = (artwork) =>
  Number(artwork?.purchasePrice ?? artwork?.startingPrice ?? artwork?.fixedPrice ?? artwork?.currentBid ?? 0);

export default function ArtistDashboard({ currentUser }) {
  const [artistArtworks, setArtistArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [valuationOpen, setValuationOpen] = useState(false);
  const [valuationText, setValuationText] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: 'Emerging',
    priceMode: 'auction',
    fixedPrice: '',
    story: ''
  });

  const loadArtistArt = async () => {
    if (!currentUser?._id && !currentUser?.id) {
      setArtistArtworks([]);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('museart_token');
      const res = await fetch('/api/gallery/artworks', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json().catch(() => []);
      const currentId = currentUser?._id || currentUser?.id;
      const filtered = Array.isArray(data)
        ? data.filter((art) => {
            const owner = art.creatorId || art.artistID || art.artistId || art.ownerId || art.artist;
            return (
              String(owner) === String(currentId) ||
              String(art.creatorId) === String(currentId) ||
              String(art.artist || '').toLowerCase() === String(currentUser?.name || '').toLowerCase()
            );
          })
        : [];
      setArtistArtworks(filtered);
    } catch (error) {
      setArtistArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtistArt();
  }, [currentUser]);

  const soldItems = useMemo(
    () => artistArtworks.filter((a) => a.status === 'sold'),
    [artistArtworks]
  );

  const salesVolume = useMemo(
    () =>
      soldItems.reduce(
        (sum, art) =>
          sum +
          Number(art.purchasePrice || art.currentBid || art.startingPrice || art.fixedPrice || 0),
        0
      ),
    [soldItems]
  );

  const isHomePainter = String(currentUser?.artistTier || '').toLowerCase() === 'home painter';
  const promotedToModern = isHomePainter && salesVolume >= PROMOTION_THRESHOLD;
  const modernAllowed = promotedToModern || ['modern', 'master', 'admin'].includes(String(currentUser?.role || '').toLowerCase());

  useEffect(() => {
    if (promotedToModern && formData.category === 'Emerging') {
      setFormData((prev) => ({ ...prev, category: 'Modern' }));
    }
  }, [promotedToModern, formData.category]);

  const liveAuctions = useMemo(() => {
    const fromApi = artistArtworks
      .filter((a) => a.status === 'auction')
      .map((a) => {
        let endsInText = 'Live';
        if (a.auctionEndTime) {
          const diff = new Date(a.auctionEndTime).getTime() - Date.now();
          if (diff <= 0) {
            endsInText = 'Ended';
          } else {
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            endsInText = `${h}h ${m}m`;
          }
        }
        return {
          id: a.id || a._id,
          title: a.title,
          highestBidder: a.highestBidder || a.currentHighestBidder || 'Anonymous Collector',
          endsIn: endsInText
        };
      });
    return fromApi.length ? fromApi : DEFAULT_AUCTION_ITEMS;
  }, [artistArtworks]);

  const wingPerformance = useMemo(() => {
    const totals = artistArtworks.reduce(
      (acc, art) => {
        const wing = String(art.category || '').toLowerCase();
        if (wing.includes('master') || wing.includes('classical')) acc.Master += 1;
        else if (wing.includes('modern')) acc.Modern += 1;
        else acc.Emerging += 1;
        return acc;
      },
      { Master: 0, Modern: 0, Emerging: 0 }
    );
    const mapped = Object.entries(totals).map(([wing, count]) => ({
      wing,
      count,
      image: WING_IMAGES[wing]
    }));
    const hasData = mapped.some((i) => i.count > 0);
    return hasData ? mapped : DEFAULT_WING_PERFORMANCE;
  }, [artistArtworks]);

  const handleValuation = async () => {
    const storyText = formData.story.trim();
    if (!storyText) return;

    try {
      const token = localStorage.getItem('museart_token');
      const res = await fetch('/api/gallery/artist/museai-valuation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ story: storyText })
      });

      const data = await res.json().catch(() => null);
      const suggestedPrice = data?.suggestedPrice || 450;
      setValuationText(
        `Based on your story's emotional depth and current abstract trends, we suggest a starting bid of ₹${suggestedPrice}.`
      );
    } catch (error) {
      setValuationText(
        "Based on your story's emotional depth and current abstract trends, we suggest a starting bid of ₹450."
      );
    }
    setValuationOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('museart_token');
      const response = await fetch('/api/gallery/artist/artwork', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: formData.title,
          image: formData.image,
          category: formData.category === 'Master' ? 'Classical' : formData.category,
          status: formData.priceMode === 'auction' ? 'auction' : 'exhibition',
          startingPrice: Number(formData.fixedPrice || 0),
          fixedPrice: Number(formData.fixedPrice || 0),
          description: formData.story,
          artistID: currentUser?._id || currentUser?.id
        })
      });
      if (!response.ok) {
        throw new Error('Failed to publish artwork. The image might be too large.');
      }
      setFormData({
        title: '',
        image: '',
        category: modernAllowed ? 'Modern' : 'Emerging',
        priceMode: 'auction',
        fixedPrice: '',
        story: ''
      });
      // Refresh the list to show the newly published artwork
      await loadArtistArt();
      alert('Artwork published successfully!');
    } catch (error) {
      alert(error.message || 'Failed to publish artwork. Please try a smaller image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditArtwork = (artwork) => {
    setEditingArtwork({
      id: artwork.id || artwork._id,
      title: artwork.title || '',
      image: artwork.image || '',
      category: artwork.category === 'Classical' ? 'Master' : (artwork.category || 'Emerging'),
      status: artwork.status === 'auction' ? 'auction' : 'exhibition',
      startingPrice: artwork.startingPrice || artwork.fixedPrice || artwork.currentBid || '',
      description: artwork.description || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingArtwork) return;
    setIsSavingEdit(true);
    try {
      const token = localStorage.getItem('museart_token');
      const response = await fetch(`/api/gallery/artist/artwork/${editingArtwork.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: editingArtwork.title,
          image: editingArtwork.image,
          category: editingArtwork.category === 'Master' ? 'Classical' : editingArtwork.category,
          status: editingArtwork.status,
          startingPrice: Number(editingArtwork.startingPrice || 0),
          fixedPrice: Number(editingArtwork.startingPrice || 0),
          description: editingArtwork.description
        })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to update artwork.');
      }
      alert('Artwork updated successfully.');
      setEditingArtwork(null);
      await loadArtistArt();
    } catch (error) {
      alert(error.message || 'Failed to update artwork.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteArtwork = async (artworkId) => {
    if (!window.confirm('Delete this artwork permanently?')) return;
    setDeletingId(artworkId);
    try {
      const token = localStorage.getItem('museart_token');
      const response = await fetch(`/api/gallery/artist/artwork/${artworkId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to delete artwork.');
      }
      alert('Artwork deleted successfully.');
      await loadArtistArt();
    } catch (error) {
      alert(error.message || 'Failed to delete artwork.');
    } finally {
      setDeletingId(null);
    }
  };

  const topMonth = DEFAULT_SALES.reduce((best, item) => (item.value > best.value ? item : best), DEFAULT_SALES[0]);

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 py-28 text-white">
      <div className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.5em] text-gold font-black">Virtual Studio</p>
        <h1 className="text-5xl md:text-7xl font-serif italic mt-4">Artist Dashboard</h1>
        {promotedToModern && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-xs uppercase tracking-widest font-bold text-gold">
            <Sparkles className="w-4 h-4" />
            Modern Hub Badge Unlocked
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-5 h-5 text-gold" />
            <h2 className="text-2xl font-serif italic">The Storyteller Upload Form</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Artwork title"
              className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
            />
            <div className="relative">
              <input
                required
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData((prev) => ({ ...prev, image: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="image-upload"
              />
              <label 
                htmlFor="image-upload"
                className="w-full flex items-center justify-center bg-black/20 border border-white/20 border-dashed rounded-xl px-4 py-6 text-sm cursor-pointer hover:border-gold/60 transition-colors"
              >
                {formData.image ? (
                   <div className="flex flex-col items-center gap-2">
                     <img src={formData.image} alt="Preview" className="h-20 object-cover rounded-md" />
                     <span className="text-xs text-gold">Image Selected - Click to change</span>
                   </div>
                ) : (
                   <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Upload className="w-6 h-6 mb-1 opacity-50" />
                      <span>Click to upload painting image</span>
                   </div>
                )}
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
              >
                <option value="Master">Master Wing</option>
                <option value="Modern" disabled={!modernAllowed}>
                  Modern Wing {!modernAllowed ? '(Locked)' : ''}
                </option>
                <option value="Emerging">Emerging Studio</option>
              </select>

              <div className="flex gap-2">
                {['auction', 'fixed'].map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setFormData((prev) => ({ ...prev, priceMode: mode }))}
                    className={`flex-1 rounded-xl py-3 text-xs uppercase tracking-widest font-black border ${
                      formData.priceMode === mode
                        ? 'bg-gold text-black border-gold'
                        : 'border-white/20 text-gray-300'
                    }`}
                  >
                    {mode === 'auction' ? 'Auction' : 'Fixed Price'}
                  </button>
                ))}
              </div>
            </div>

            <input
              required
              type="number"
              value={formData.fixedPrice}
              onChange={(e) => setFormData((prev) => ({ ...prev, fixedPrice: e.target.value }))}
              placeholder={formData.priceMode === 'auction' ? 'Starting bid' : 'Fixed price'}
              className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
            />

            <textarea
              required
              rows={7}
              value={formData.story}
              onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
              placeholder="The Soul of the Piece"
              className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60 resize-none"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleValuation}
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-5 py-3 text-xs uppercase tracking-widest font-black hover:border-gold/60"
              >
                <Bot className="w-4 h-4" />
                Analyze with MuseAI
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-gold text-black px-6 py-3 text-xs uppercase tracking-widest font-black"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Artwork'}
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-8">
          <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Radio className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold">Live Auction Tracker</h3>
            </div>
            <div className="space-y-4">
              {liveAuctions.map((auction) => (
                <div key={auction.id} className="rounded-xl border border-white/10 p-4 bg-black/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{auction.title}</span>
                    <span className="inline-flex items-center gap-2 text-red-400 text-xs">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Live
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-2">Highest bidder: {auction.highestBidder}</p>
                  <p className="text-xs text-gray-400 mt-1">Time remaining: {auction.endsIn}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-5 h-5 text-gold" />
              <h3 className="text-lg font-semibold">Earnings Analytics</h3>
            </div>
            <p className="text-xs text-gray-300 mb-4">Best month: {topMonth.month} (₹{topMonth.value})</p>
            <div className="space-y-2 mb-6">
              {DEFAULT_SALES.map((point) => (
                <div key={point.month}>
                  <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                    <span>{point.month}</span>
                    <span>₹{point.value}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold"
                      style={{ width: `${Math.max(8, (point.value / topMonth.value) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {wingPerformance.map((item) => (
                <div key={item.wing} className="rounded-xl overflow-hidden border border-white/10 bg-black/20">
                  <div className="h-16">
                    <img
                      src={item.image}
                      alt={`${item.wing} wing`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-xs text-gray-300 p-3">
                    {item.wing} Wing Performance: <span className="text-gold font-semibold">{item.count} pieces</span>
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">Sold volume: ₹{salesVolume.toLocaleString()}</p>
          </section>
        </aside>
      </div>

      <section className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-6">
        <h3 className="text-lg font-semibold mb-4">Previous Works</h3>
        {loading ? (
          <p className="text-sm text-gray-400">Loading your works...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-2">Painting Name</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Starting Price</th>
                  <th className="py-3 px-2">Final/Sold Price</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(artistArtworks.length ? artistArtworks : [{ id: 'demo', title: 'No works yet', status: '-', startingPrice: '-', purchasePrice: '-' }]).map((row) => (
                  <tr key={row.id || row._id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-2 font-medium">{row.title}</td>
                    <td className="py-4 px-2">
                       <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-widest ${
                         row.status === 'sold' ? 'bg-gold/10 text-gold' : 
                         row.status === 'auction' ? 'bg-red-500/10 text-red-400' : 'bg-white/10 text-gray-300'
                       }`}>
                         {row.status}
                       </span>
                    </td>
                    <td className="py-4 px-2">
                       {getEffectivePrice(row) > 0 ? `₹${getEffectivePrice(row).toLocaleString()}` : '-'}
                    </td>
                    <td className="py-4 px-2">
                       {row.status === 'sold' ? `₹${getEffectivePrice(row).toLocaleString()}` : '-'}
                    </td>
                    <td className="py-4 px-2">
                      {row.id === 'demo' ? (
                        <span className="text-gray-500 text-xs">-</span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditArtwork(row)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 text-xs uppercase tracking-widest hover:bg-white/20"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteArtwork(row.id || row._id)}
                            disabled={deletingId === (row.id || row._id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-xs uppercase tracking-widest hover:bg-red-500/30 disabled:opacity-60"
                          >
                            {deletingId === (row.id || row._id) ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editingArtwork && (
        <div className="fixed inset-0 z-120 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-2xl w-full rounded-2xl border border-white/20 bg-[#0e0e0e] p-7">
            <h4 className="text-xl font-serif italic mb-5">Edit Artwork</h4>
            <div className="space-y-4">
              <input
                value={editingArtwork.title}
                onChange={(e) => setEditingArtwork((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Artwork title"
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
              />
              <input
                value={editingArtwork.image}
                onChange={(e) => setEditingArtwork((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="Image URL or base64"
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
              />
              <div className="grid md:grid-cols-3 gap-3">
                <select
                  value={editingArtwork.category}
                  onChange={(e) => setEditingArtwork((prev) => ({ ...prev, category: e.target.value }))}
                  className="bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
                >
                  <option value="Master">Master Wing</option>
                  <option value="Modern">Modern Wing</option>
                  <option value="Emerging">Emerging Studio</option>
                </select>
                <select
                  value={editingArtwork.status}
                  onChange={(e) => setEditingArtwork((prev) => ({ ...prev, status: e.target.value }))}
                  className="bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
                >
                  <option value="auction">Auction</option>
                  <option value="exhibition">Exhibition</option>
                </select>
                <input
                  type="number"
                  value={editingArtwork.startingPrice}
                  onChange={(e) => setEditingArtwork((prev) => ({ ...prev, startingPrice: e.target.value }))}
                  placeholder="Starting price"
                  className="bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
                />
              </div>
              <textarea
                rows={5}
                value={editingArtwork.description}
                onChange={(e) => setEditingArtwork((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Artwork description"
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60 resize-none"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="rounded-xl bg-gold text-black px-5 py-2 text-xs uppercase tracking-widest font-black disabled:opacity-60"
              >
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditingArtwork(null)}
                disabled={isSavingEdit}
                className="rounded-xl bg-white/10 text-white px-5 py-2 text-xs uppercase tracking-widest font-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {valuationOpen && (
        <div className="fixed inset-0 z-120 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-2xl border border-gold/40 bg-[#0e0e0e] p-7">
            <h4 className="text-xl font-serif italic mb-3">MuseAI Valuation</h4>
            <p className="text-sm text-gray-200">{valuationText}</p>
            <button
              onClick={() => setValuationOpen(false)}
              className="mt-6 rounded-xl bg-gold text-black px-5 py-2 text-xs uppercase tracking-widest font-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
