import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { 
  getArtworks, 
  postArtwork, 
  updateArtworkStatus,
  placeBid,
  acquireArtwork,
  createRazorpayOrder,
  verifyPayment,
  getMyOrders,
  updateDelivery,
  resellArtwork,
  updateArtistArtwork,
  deleteArtistArtwork,
  manageArtworkListing
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/artworks', getArtworks);
router.post('/artist/artwork', authenticate, postArtwork);
router.post('/admin/artworks/:id/status', authenticate, updateArtworkStatus);
router.post('/bid', authenticate, placeBid);
router.post('/acquire', authenticate, acquireArtwork);
router.post('/create-order', authenticate, createRazorpayOrder);
router.post('/verify-payment', authenticate, verifyPayment);
router.get('/my-orders', authenticate, getMyOrders);
router.put('/update-delivery', authenticate, updateDelivery);
router.post('/resell', authenticate, resellArtwork);
router.put('/artist/artwork/:id', authenticate, updateArtistArtwork);
router.delete('/artist/artwork/:id', authenticate, deleteArtistArtwork);
router.post('/admin/artworks/:id/manage', authenticate, manageArtworkListing);

export default router;
