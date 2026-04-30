import mongoose from "mongoose";
import "dotenv/config";
import crypto from "crypto";
import Razorpay from "razorpay";
import { Artwork } from "../models/Admin/Additem.js";

const getArtworkQueryByParam = (paramId) => {
  if (mongoose.Types.ObjectId.isValid(paramId)) {
    return { $or: [{ id: String(paramId) }, { _id: paramId }] };
  }
  return { id: String(paramId) };
};

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
    const normalizedPrice = Number(
      artworkData.startingPrice ?? artworkData.fixedPrice ?? artworkData.currentBid ?? 0
    );
    const artwork = new Artwork({
      ...artworkData,
      id: Math.random().toString(36).substr(2, 9),
      creatorId: req.user.id,
      artist: req.user.name || "Unknown Artist",
      startingPrice: normalizedPrice,
      fixedPrice: normalizedPrice,
      currentBid: normalizedPrice,
      status: artworkData.status || 'exhibition',
      moderationStatus: 'pending',
      promoted: false,
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
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required." });
    }

    const allowedStatuses = ["auction", "exhibition", "sold"];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: "Invalid artwork status." });
    }

    const updates = { status: req.body.status };
    if (req.body.status === "sold") {
      updates.moderationStatus = "closed";
      updates.auctionEndTime = null;
    } else if (req.body.status === "auction" || req.body.status === "exhibition") {
      updates.moderationStatus = "approved";
    }

    const artwork = await Artwork.findOneAndUpdate(getArtworkQueryByParam(req.params.id), updates, { new: true });
    if (!artwork) return res.status(404).json({ error: "Artwork not found." });
    res.json({ success: true, artwork });
  } catch (error) {
    res.status(500).json({ error: "Status update failed" });
  }
};

export const manageArtworkListing = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected." });
  }

  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required." });
    }

    const { action } = req.body;
    const artwork = await Artwork.findOne(getArtworkQueryByParam(req.params.id));
    if (!artwork) {
      return res.status(404).json({ error: "Artwork not found." });
    }

    if (!["approve", "promote", "close"].includes(action)) {
      return res.status(400).json({ error: "Invalid action." });
    }

    if (action === "approve") {
      artwork.moderationStatus = "approved";
      if (artwork.status === "sold") {
        artwork.status = "exhibition";
      }
    }

    if (action === "promote") {
      artwork.promoted = true;
      if (artwork.moderationStatus === "pending") {
        artwork.moderationStatus = "approved";
      }
    }

    if (action === "close") {
      artwork.moderationStatus = "closed";
      artwork.status = "sold";
      artwork.auctionEndTime = null;
    }

    await artwork.save();
    res.json({ success: true, artwork });
  } catch (error) {
    console.error("Manage listing error:", error);
    res.status(500).json({ error: "Failed to manage listing." });
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

export const updateArtistArtwork = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected." });
  }

  try {
    const artwork = await Artwork.findOne(getArtworkQueryByParam(req.params.id));
    if (!artwork) {
      return res.status(404).json({ error: "Artwork not found." });
    }

    if (String(artwork.creatorId) !== String(req.user.id)) {
      return res.status(403).json({ error: "You can only edit your own uploaded artworks." });
    }

    const allowedFields = ["title", "image", "category", "description", "status", "startingPrice", "fixedPrice"];
    const updates = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields provided for update." });
    }

    if (typeof updates.title !== "undefined") {
      updates.title = String(updates.title).trim();
      if (!updates.title) {
        return res.status(400).json({ error: "Title is required." });
      }
    }

    if (typeof updates.description !== "undefined") {
      updates.description = String(updates.description).trim();
      if (!updates.description) {
        return res.status(400).json({ error: "Description is required." });
      }
    }

    if (typeof updates.status !== "undefined" && !["auction", "exhibition"].includes(updates.status)) {
      return res.status(400).json({ error: "Invalid status. Use auction or exhibition." });
    }

    const incomingPrice =
      typeof updates.startingPrice !== "undefined"
        ? updates.startingPrice
        : (typeof updates.fixedPrice !== "undefined" ? updates.fixedPrice : undefined);

    if (typeof incomingPrice !== "undefined") {
      const price = Number(incomingPrice);
      if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).json({ error: "Starting price must be greater than zero." });
      }
      updates.startingPrice = price;
      updates.fixedPrice = price;
      if ((updates.status || artwork.status) === "auction") {
        updates.currentBid = Math.max(Number(artwork.currentBid || 0), price);
      } else {
        updates.currentBid = price;
      }
    }

    Object.assign(artwork, updates);
    await artwork.save();
    res.json({ success: true, artwork });
  } catch (error) {
    console.error("Update artist artwork error:", error);
    res.status(500).json({ error: "Failed to update artwork." });
  }
};

export const deleteArtistArtwork = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected." });
  }

  try {
    const artwork = await Artwork.findOne(getArtworkQueryByParam(req.params.id));
    if (!artwork) {
      return res.status(404).json({ error: "Artwork not found." });
    }

    if (String(artwork.creatorId) !== String(req.user.id)) {
      return res.status(403).json({ error: "You can only delete your own uploaded artworks." });
    }

    await Artwork.deleteOne(getArtworkQueryByParam(req.params.id));
    res.json({ success: true, message: "Artwork deleted successfully." });
  } catch (error) {
    console.error("Delete artist artwork error:", error);
    res.status(500).json({ error: "Failed to delete artwork." });
  }
};
