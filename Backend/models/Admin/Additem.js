import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  artist: { type: String, required: true }, // Display name
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // DB reference
  artistBio: String,
  category: String,
  styleName: String,
  styleDescription: String,
  image: String,
  description: String,
  aiValuation: String,
  startingPrice: Number,
  currentBid: Number,
  highBidder: String,
  highBidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  auctionEndTime: Date,
  bids: [{
    bidderName: String,
    bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    time: { type: Date, default: Date.now }
  }],
  deliveryStatus: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
  timerSeconds: Number,
  status: { type: String, enum: ['auction', 'exhibition', 'sold'], default: 'exhibition' },
  moderationStatus: { type: String, enum: ['pending', 'approved', 'closed'], default: 'pending' },
  promoted: { type: Boolean, default: false },
  purchasePrice: Number,
  currentMarketValue: Number,
  isUserOwned: { type: Boolean, default: false },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Artwork = mongoose.model('Artwork', artworkSchema);
