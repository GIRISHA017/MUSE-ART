import cron from 'node-cron';
import { Artwork } from './models/Admin/Additem.js';

export const startScheduler = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      // Find all artworks where auction is still live but time has passed
      const expiredAuctions = await Artwork.find({
        status: 'auction',
        auctionEndTime: { $lt: now }
      });

      if (expiredAuctions.length > 0) {
        console.log(`[SCHEDULER] Found ${expiredAuctions.length} expired auctions. Updating status...`);
        for (const artwork of expiredAuctions) {
          // If there are bids, the highest bidder wins. Wait, we already tracked highBidder.
          // The item should stay as 'auction' but effectively ended? 
          // Wait, the spec says: "Auction status changes to 'ended'". 
          // But our frontend expects 'auction' to show it in the user's vault to pay for it, 
          // OR we can change it to 'ended' and update the frontend to check for 'ended'. 
          // Let's change it to 'ended'.
          artwork.status = 'ended';
          await artwork.save();
        }
      }
    } catch (err) {
      console.error('[SCHEDULER ERROR] Failed to process expired auctions:', err);
    }
  });
};
