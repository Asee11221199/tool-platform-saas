import { Router } from 'express';
import { prisma } from '../index.js';
import { verifyToken } from '../lib/jwt.js';
import { normalizeFingerprint } from '../lib/device.js';

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

router.get('/status', authMiddleware, async (req: any, res) => {
  const userId = req.user.userId;

  const devices = await prisma.device.findMany({
    where: { userId }
  });

  return res.json({
    bindCount: devices.length,
    devices
  });
});

router.post('/bind', authMiddleware, async (req: any, res) => {
  const { fingerprint, platform, userAgent } = req.body;
  const userId = req.user.userId;

  if (!fingerprint) {
    return res.status(400).json({ message: '缺少设备指纹' });
  }

  const normalized = normalizeFingerprint(fingerprint);

  const exists = await prisma.device.findFirst({
    where: { fingerprint: normalized }
  });

  if (exists && exists.userId !== userId) {
    return res.status(409).json({
      message: '该设备已绑定其他账号，无法重复绑定'
    });
  }

  const userDevices = await prisma.device.findMany({
    where: { userId }
  });

  if (userDevices.length >= 1) {
    return res.status(409).json({
      message: '当前账号已绑定设备，不能重复绑定另一台设备'
    });
  }

  const device = await prisma.device.upsert({
    where: { fingerprint: normalized },
    update: {
      platform,
      userAgent
    },
    create: {
      userId,
      fingerprint: normalized,
      platform,
      userAgent
    }
  });

  return res.json({
    message: '设备绑定成功',
    device
  });
});

export default router;