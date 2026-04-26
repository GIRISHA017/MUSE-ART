import express from 'express';
import "dotenv/config";
import { register, login } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;
