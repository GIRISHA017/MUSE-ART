import React from 'react';
import { Gavel, Eye, Sparkles } from 'lucide-react';

export default function ArtworkCard({
  artwork,
  onOpenDetails,
  onPlaceBid,
  onAcquire,
  onArtistClick,
  onStyleClick
}) {
  const price =
    artwork?.status === 'auction'
      ? artwork?.currentBid
      : artwork?.purchasePrice || artwork?.startingPrice || 0;

  const isAuctionEnded = artwork?.status === 'auction' && artwork?.auctionEndTime && new Date(artwork?.auctionEndTime).getTime() < Date.now();

  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 overflow-hidden group">
      <button className="w-full text-left" onClick={() => onOpenDetails?.(artwork)}>
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={artwork?.image}
            alt={artwork?.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      </button>

      <div className="p-5 space-y-3">
        <h3 className="text-2xl font-serif italic">{artwork?.title}</h3>
        <button
          onClick={() => onArtistClick?.(artwork?.artist)}
          className="text-xs uppercase tracking-wider text-gold"
        >
          {artwork?.artist}
        </button>

        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => onStyleClick?.(artwork?.styleName || artwork?.category)}
            className="text-gray-300 hover:text-white"
          >
            {artwork?.styleName || artwork?.category || 'Uncategorized'}
          </button>
          <span className="text-gold font-semibold">₹{Number(price || 0).toLocaleString()}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onOpenDetails?.(artwork)}
            className="flex-1 rounded-xl border border-white/20 px-3 py-2 text-[11px] uppercase tracking-wider inline-flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          {artwork?.status === 'auction' ? (
            <button
              onClick={() => isAuctionEnded ? onOpenDetails?.(artwork) : onPlaceBid?.(artwork)}
              className={`flex-1 rounded-xl px-3 py-2 text-[11px] uppercase tracking-wider inline-flex items-center justify-center gap-1 ${isAuctionEnded ? 'bg-white/10 text-gray-500' : 'bg-gold text-black'}`}
            >
              <Gavel className="w-3.5 h-3.5" />
              {isAuctionEnded ? 'Ended' : 'Bid'}
            </button>
          ) : (
            <button
              onClick={() => onAcquire?.(artwork)}
              className="flex-1 rounded-xl bg-gold text-black px-3 py-2 text-[11px] uppercase tracking-wider inline-flex items-center justify-center gap-1"
              disabled={artwork?.status === 'sold'}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {artwork?.status === 'sold' ? 'Sold' : 'Buy'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
