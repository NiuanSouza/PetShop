import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { createMyPetSchema, updateMyPetSchema } from '../validation/myPetSchema.js';

const router = express.Router();

// All my-pet routes require auth
router.use(authenticate as any);

// List my pets
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const pets = await prisma.myPet.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(pets);
  } catch (err) {
    next(err);
  }
});

// Get one of my pets
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const pet = await prisma.myPet.findFirst({
      where: { id, userId: req.userId },
      include: { appointments: { include: { service: true } } },
    });
    if (!pet) return res.status(404).json({ error: 'Pet não encontrado' });
    res.json(pet);
  } catch (err) {
    next(err);
  }
});

// Register a new pet
router.post('/', validate(createMyPetSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const pet = await prisma.myPet.create({
      data: { ...req.body, userId: req.userId! },
    });
    res.status(201).json(pet);
  } catch (err) {
    next(err);
  }
});

// Update my pet
router.put('/:id', validate(updateMyPetSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    // Ensure ownership
    const existing = await prisma.myPet.findFirst({ where: { id, userId: req.userId } });
    if (!existing) return res.status(404).json({ error: 'Pet não encontrado' });

    const pet = await prisma.myPet.update({ where: { id }, data: req.body });
    res.json(pet);
  } catch (err) {
    next(err);
  }
});

// Delete my pet
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const existing = await prisma.myPet.findFirst({ where: { id, userId: req.userId } });
    if (!existing) return res.status(404).json({ error: 'Pet não encontrado' });

    await prisma.appointment.deleteMany({ where: { myPetId: id } });
    await prisma.myPet.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
