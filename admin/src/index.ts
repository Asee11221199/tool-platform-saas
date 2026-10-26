import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import deviceRoutes from './routes/device.js';
import cardsRoutes from './routes/cards.js';

export const prisma = new PrismaClient();

const app = express();

app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/cards', cardsRoutes);

app.listen(config.port, () => {
  console.log(`Backend running at http://localhost:${config.port}`);
});