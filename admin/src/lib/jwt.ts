import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function signToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, config.jwtSecret) as {
    userId: string;
    email: string;
  };
}