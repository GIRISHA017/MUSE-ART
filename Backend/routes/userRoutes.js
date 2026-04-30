import express from 'express';
import "dotenv/config";
import { register, login, getProfile, updateProfile } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
