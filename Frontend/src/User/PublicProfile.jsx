import React, { useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, Star, Users } from 'lucide-react';

const FALLBACK_ART = [
  {
    id: 'p1',
    title: 'Aurora Fragments',
    image: 'https://picsum.photos/seed/aurora-fragments/900/1100',
    category: 'Abstract',
    type: 'Abstract'
  },
  {
    id: 'p2',
    title: 'Silent Basilica',
    image: 'https://picsum.photos/seed/silent-basilica/900/1100',
    category: 'Classical',
    type: 'Classical'
  },
  {
    id: 'p3',
    title: 'Glass Pulse',
    image: 'https://picsum.photos/seed/glass-pulse/900/1100',
    category: 'Modern',
    type: 'Modern'
  }
];

const REVIEWS = [
  { id: 1, quote: 'The piece arrived exactly as showcased. Incredible emotional depth.', name: 'Auction Winner - Naina P.' },
  { id: 2, quote: 'One of the most refined bidding experiences and truly premium art.', name: 'Collector - Harsh V.' }
];

export default function PublicProfile({
  onReturnHome,
  artistName = 'Unknown Artist',
  artistUser = null,
  artworks = []
}) {
  const [followed, setFollowed] = useState(false);
  const [activeType, setActiveType] = useState('All');

  const profileArt = useMemo(() => (artworks.length ? artworks : FALLBACK_ART), [artworks]);

  const types = useMemo(() => {
    const fromData = [...new Set(profileArt.map((a) => a.type || a.category || 'Uncategorized'))];
    return ['All', ...fromData];
  }, [profileArt]);

  const visibleArt = useMemo(() => {
    if (activeType === 'All') return profileArt;
    return profileArt.filter((a) => (a.type || a.category || 'Uncategorized') === activeType);
  }, [activeType, profileArt]);

  const reputationLabel = useMemo(() => {
    const role = String(artistUser?.role || '').toLowerCase();
    if (role === 'master') return 'Verified Master';
    if (role === 'modern') return 'Modern Hub';
    return 'Rising Star';
  }, [artistUser]);

  const followerCount = artistUser?.followers || 2840;
  const bio =
    artistUser?.bio ||
    'A poetic blend of memory, abstraction, and light. Every stroke carries a fragment of lived silence.';
  const profilePic = artistUser?.profileImage || 'https://picsum.photos/seed/artist-portrait/500/500';
  const coverArt = profileArt[0]?.image || 'https://picsum.photos/seed/artist-cover/1600/600';

  const openBiddingView = (art) => {
    const flipUrl = `/artwork/${art.id || art._id}?view=flip-bid`;
    window.open(flipUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 pt-28 pb-20 text-white">
      <button
        onClick={onReturnHome}
        className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        Back to marketplace
      </button>

      <section className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="h-56 w-full">
          <img src={coverArt} alt="Cover art" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-end justify-between">
          <div className="flex gap-5">
            <img
              src={profilePic}
              alt={artistName}
              className="w-24 h-24 rounded-2xl object-cover border border-gold/40"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-serif italic">{artistName}</h1>
              <p className="text-sm text-gray-300 mt-2 max-w-2xl">{bio}</p>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <span className="inline-flex items-center gap-1 text-gold">
                  <Users className="w-4 h-4" /> {followerCount.toLocaleString()} followers
                </span>
                <span className="inline-flex items-center gap-1 bg-gold/15 border border-gold/30 px-2.5 py-1 rounded-full text-gold">
                  <BadgeCheck className="w-3.5 h-3.5" /> {reputationLabel}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setFollowed((f) => !f)}
            className={`h-fit rounded-xl px-5 py-3 text-xs uppercase tracking-widest font-black ${
              followed ? 'bg-white/10 border border-white/30' : 'bg-gold text-black'
            }`}
          >
            {followed ? 'Following' : 'Follow'}
          </button>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap gap-2 mb-5">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest border ${
                activeType === type ? 'bg-gold text-black border-gold' : 'border-white/20 text-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleArt.map((art) => (
            <button
              key={art.id || art._id}
              onClick={() => openBiddingView(art)}
              className="text-left rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-gold/40 transition-colors"
            >
              <div className="aspect-[4/5]">
                <img src={art.image} alt={art.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-serif italic">{art.title}</h3>
                <p className="text-xs text-gray-300 mt-1">{art.type || art.category || 'Uncategorized'}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-serif italic mb-4">Social Proof</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {REVIEWS.map((review) => (
            <div key={review.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-gray-100">"{review.quote}"</p>
              <p className="text-xs text-gold mt-3 flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                {review.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
