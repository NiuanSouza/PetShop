import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// List all products with filters
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, species, brandId, search, sort } = req.query;
    const where: any = {};

    if (categoryId) where.categoryId = Number(categoryId);
    if (species && typeof species === 'string') {
      where.OR = [{ species }, { species: null }];
    }
    if (brandId) where.brandId = Number(brandId);
    if (search && typeof search === 'string') {
      where.name = { contains: search, mode: 'insensitive' };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'name') orderBy = { name: 'asc' };

    const products = await prisma.product.findMany({
      where,
      include: { category: true, brand: true },
      orderBy,
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, brand: true },
    });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

export default router;
