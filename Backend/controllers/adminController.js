import mongoose from "mongoose";
import "dotenv/config";
import crypto from "crypto";
import Razorpay from "razorpay";
import { Artwork } from "../models/Admin/Additem.js";

export const getArtworks = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected." });
  }
  try {
    let artworks = await Artwork.find({}).lean();
    
    // Inject fake data for auctions if needed
    artworks = artworks.map(artwork => {
      if (artwork.status === 'auction') {
        const now = Date.now();
        // Reset timer if expired or missing
        if (!artwork.auctionEndTime || new Date(artwork.auctionEndTime).getTime() < now) {
          artwork.auctionEndTime = new Date(now + Math.floor(Math.random() * 24 * 60 * 60 * 1000) + 3600000); // Random 1 to 25 hours
        }
        
        // Add fake bids if empty
        if (!artwork.bids || artwork.bids.length === 0) {
          const fakeNames = ["Alexander G.", "Sophia M.", "Evelyn R.", "Jameson T.", "Victoria H."];
          let currentAmount = artwork.startingPrice || 50000;
          const fakeBids = [];
          const numBids = Math.floor(Math.random() * 4) + 2; // 2 to 5 bids
          
          for (let i = 0; i < numBids; i++) {
             currentAmount += Math.floor(Math.random() * 10000) + 5000;
             fakeBids.push({
               bidderName: fakeNames[i % fakeNames.length],
               amount: currentAmount,
               time: new Date(now - Math.floor(Math.random() * 10000000))
             });
          }
          
          artwork.bids = fakeBids;
          artwork.currentBid = currentAmount;
        }
      }
      return artwork;
    });

    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artworks" });
  }
};

export const postArtwork = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected." });
  }
  try {
    const artworkData = req.body;
    const artwork = new Artwork({
      ...artworkData,
      id: Math.random().toString(36).substr(2, 9),
      creatorId: req.user.id,
      artist: req.user.name || "Unknown Artist",
      currentBid: artworkData.startingPrice || 0,
      status: artworkData.status || 'exhibition',
      auctionEndTime: artworkData.status === 'auction' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null
    });
    await artwork.save();
    res.json({ success: true, artwork });
  } catch (error) {
    res.status(500).json({ error: "Failed to post artwork" });
  }
};

export const updateArtworkStatus = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected." });
  }
  try {
    const artwork = await Artwork.findOneAndUpdate({ id: req.params.id }, { status: req.body.status }, { new: true });
    res.json({ success: true, artwork });
  } catch (error) {
    res.status(500).json({ error: "Status update failed" });
  }
};

export const placeBid = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected." });
  }
  try {
    const { artworkId, amount } = req.body;
    const artwork = await Artwork.findOne({ id: artworkId });
    if (!artwork) return res.status(404).json({ error: "Artwork not found" });
    if (amount <= artwork.currentBid) return res.status(400).json({ error: "Bid too low" });

    if (artwork.auctionEndTime && Date.now() > new Date(artwork.auctionEndTime).getTime()) {
      return res.status(400).json({ error: "Auction has ended" });
    }

    artwork.currentBid = amount;
    artwork.highBidder = req.user.name || "Collector";
    artwork.highBidderId = req.user.id;
    artwork.bids.push({
      bidderName: req.user.name || "Collector",
      bidderId: req.user.id,
      amount: amount
    });
    await artwork.save();
    res.json({ success: true, artwork });
  } catch (error) {
    res.status(500).json({ error: "Bid failed" });
  }
};

export const acquireArtwork = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected." });
  }
  try {
    const { artworkId } = req.body;
    const artwork = await Artwork.findOne({ id: artworkId });
    if (!artwork) return res.status(404).json({ error: "Artwork not found" });

    const isAuction = artwork.status === 'auction' || artwork.status === 'ended';
    artwork.status = 'sold';
    artwork.isUserOwned = true;
    artwork.ownerId = req.user.id;
    artwork.purchasePrice = isAuction ? artwork.currentBid : artwork.startingPrice;
    if (!isAuction) {
        artwork.highBidder = req.user.name || 'Owner';
    }
    artwork.currentMarketValue = artwork.purchasePrice + Math.floor(Math.random() * 50000); // simulate some market change
    await artwork.save();
    res.json({ success: true, artwork });
  } catch (error) {
    res.status(500).json({ error: "Acquisition failed" });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Mock order if secrets are not available
      return res.json({
        id: 'order_mock_' + Math.random().toString(36).substr(2, 9),
        amount: amount * 100,
        currency: 'INR'
      });
    }
    
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_order_" + Math.random().toString(36).substr(2, 9),
    };

    const order = await instance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, artworkId } = req.body;
    
    if (process.env.RAZORPAY_KEY_SECRET) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");
        
      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: "Invalid signature" });
      }
    }

    // Payment is valid (or mocked valid), process acquisition
    const artwork = await Artwork.findOne({ id: artworkId });
    if (!artwork) return res.status(404).json({ error: "Artwork not found" });

    const isAuction = artwork.status === 'auction' || artwork.status === 'ended';
    artwork.status = 'sold';
    artwork.isUserOwned = true;
    artwork.ownerId = req.user.id;
    artwork.purchasePrice = isAuction ? artwork.currentBid : artwork.startingPrice;
    if (!isAuction) {
        artwork.highBidder = req.user.name || 'Owner';
    }
    artwork.currentMarketValue = artwork.purchasePrice + Math.floor(Math.random() * 50000);
    artwork.deliveryStatus = 'processing';
    await artwork.save();
    
    res.json({ success: true, artwork });
  } catch (error) {
    res.status(500).json({ error: "Payment verification failed" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Artwork.find({ ownerId: req.user.id, isUserOwned: true });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const updateDelivery = async (req, res) => {
  try {
    // Ideally this requires admin auth
    const { artworkId, deliveryStatus } = req.body;
    const artwork = await Artwork.findOneAndUpdate({ id: artworkId }, { deliveryStatus }, { new: true });
    res.json({ success: true, artwork });
  } catch (error) {
    res.status(500).json({ error: "Failed to update delivery status" });
  }
};
export const resellArtwork = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected." });
  }
  try {
    const { artworkId, price } = req.body;
    const artwork = await Artwork.findOne({ id: artworkId });
    
    if (!artwork) {
       return res.status(404).json({ error: "Artwork not found." });
    }
    
    if (String(artwork.ownerId) !== String(req.user.id)) {
       console.error(`Unauthorized resell attempt: artwork.ownerId=${artwork.ownerId}, req.user.id=${req.user.id}`);
       return res.status(403).json({ error: "Unauthorized to resell this asset." });
    }
    
    // Reset fields for marketplace
    artwork.status = 'exhibition'; // or auction, depending on platform logic. We use exhibition for direct buy.
    artwork.startingPrice = Number(price);
    artwork.currentBid = Number(price);
    artwork.bids = [];
    artwork.isUserOwned = false;
    artwork.ownerId = null;
    artwork.auctionEndTime = null;
    
    await artwork.save();
    res.json({ success: true, artwork });
  } catch (error) {
    console.error("Resell Error:", error);
    res.status(500).json({ error: "Failed to resell artwork." });
  }
};
