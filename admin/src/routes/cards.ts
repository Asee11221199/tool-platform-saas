import { Router } from 'express';
import { prisma } from '../index.js';
import { verifyToken } from '../lib/jwt.js';
import { generateBatchCodes } from '../lib/code.js';

const router = Router();

function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: '未登录' });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Token 无效' });
  }
}

router.get('/', authMiddleware, async (req: any, res) => {
  const userId = req.user.userId;

  const cards = await prisma.card.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return res.json({ cards });
});

router.post('/generate-batch', authMiddleware, async (req: any, res) => {
  const userId = req.user.userId;
  const { count, prefix = 'USER' } = req.body;

  if (!count || count <= 0 || count > 500) {
    return res.status(400).json({ message: 'count 必须在 1~500 之间' });
  }

  const device = await prisma.device.findFirst({
    where: { userId }
  });

  if (!device) {
    return res.status(403).json({
      message: '请先绑定设备后再生成卡密'
    });
  }

  const codes = generateBatchCodes(Number(count), String(prefix));

  const data = codes.map((code) => ({
    code,
    userId,
    batchId: `batch-${Date.now()}`,
    status: 'unused'
  }));

  await prisma.card.createMany({
    data
  });

  return res.json({
    message: '生成成功',
    createdCount: data.length,
    codes
  });
});

export default router;