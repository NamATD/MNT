import { Router } from 'express';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/login', async (req: AuthRequest, res) => {
  try {
    const { username, password } = req.body;
    const User = require('../models/User').default;
    const user = await User.findOne({ username, password });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = require('jsonwebtoken').sign({ _id: user._id, username: user.username, role: user.role }, 'secret');
    res.json({ token });
  } catch (error) {
    const err = error as Error;
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;