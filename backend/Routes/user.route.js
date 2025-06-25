import express, { Router } from 'express';
import { registerUser, loginUser,getUserProfile } from '../controllers/user.controller.js';
import {authMiddleware} from '../middleware/auth.middleware.js';


const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World');
});

router.get('/profile',authMiddleware,getUserProfile);
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;