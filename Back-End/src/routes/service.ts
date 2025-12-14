import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// List all services with optional filter by type
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    const where: any = {};
    if (type && typeof type === 'string') {
      where.serviceType = type;
    }
    const services = await prisma.service.findMany({ where, orderBy: { name: 'asc' } });
    res.json(services);
  } catch (err) {
    next(err);
  }
});

// Get service by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) return res.status(404).json({ error: 'Serviço não encontrado' });
    res.json(service);
  } catch (err) {
    next(err);
  }
});

export default router;
