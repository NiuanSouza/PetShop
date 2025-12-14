import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// List all orders
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: true },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Get order by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, user: true },
    });
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// Create an order (with items)
// Body: { userId, items: [{ productId, quantity, price }] }
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const { userId, items } = req.body;
  try {
    const total = items.reduce(
      (sum: number, it: any) => sum + Number(it.price) * Number(it.quantity),
      0
    );
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: Number(userId) } },
        total,
        items: {
          create: items.map((it: any) => ({
            product: { connect: { id: Number(it.productId) } },
            quantity: Number(it.quantity),
            price: Number(it.price),
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// Update order status
router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete an order
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    await prisma.orderItem.deleteMany({ where: { orderId: id } });
    await prisma.order.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
