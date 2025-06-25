import express, { Router } from 'express';
import { registerUser, loginUser } from '../controllers/user.controller.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World');
});

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;