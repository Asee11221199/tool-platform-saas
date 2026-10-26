import { Router } from 'express';
import { prisma } from '../index.js';
import { hashPassword, comparePassword } from '../lib/password.js';
import { signToken } from '../lib/jwt.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: '缺少必要参数' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: '密码长度需至少6位' });
  }

  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  });

  if (exists) {
    return res.status(409).json({ message: '邮箱或用户名已存在' });
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash
    }
  });

  const token = signToken({ userId: user.id, email: user.email });

  return res.status(201).json({
    message: '注册成功',
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username
    }
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '缺少参数' });
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({ message: '用户不存在' });
  }

  const ok = await comparePassword(password, user.passwordHash);

  if (!ok) {
    return res.status(401).json({ message: '密码错误' });
  }

  const token = signToken({ userId: user.id, email: user.email });

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username
    }
  });
});

export default router;