import express from 'express';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validation.js';
import { registerSchema, loginSchema } from '../validation/authSchema.js';
import crypto from 'crypto';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

function createToken(userId: number): string {
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(String(userId)).digest('hex');
  return `${userId}:${sig}`;
}

router.post('/register', validate(registerSchema), async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const hashed = crypto.createHash('sha256').update(password).digest('hex');
    const user = await prisma.user.create({ data: { email, password: hashed, name } });
    const token = createToken(user.id);
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    next(e);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const hashed = crypto.createHash('sha256').update(password).digest('hex');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== hashed) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    const token = createToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    next(e);
  }
});

export default router;
