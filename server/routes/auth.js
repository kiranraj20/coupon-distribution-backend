import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; 

const router = express.Router();
 
const refreshTokens = new Map();

router.post('/login', (req, res) => {
  const { username, password } = req.body; 

  if (username === 'admin' && password === 'secret123') {
    const accessToken = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = uuidv4();
    refreshTokens.set(refreshToken, 'admin');

    return res.json({ accessToken, refreshToken });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }

  const userId = refreshTokens.get(refreshToken);
  const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ accessToken: newAccessToken });
});

router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }
  res.status(204).send();
});

export default router;