import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// List all categories (for products)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// Get category by ID with its products
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: { include: { brand: true } } },
    });
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
});

export default router;
