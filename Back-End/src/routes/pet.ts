import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { validate } from '../middleware/validation.js';
import { createPetSchema, updatePetSchema } from '../validation/petSchema.js';

const router = express.Router();

// List all pets (animals for sale) with optional filters
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { species, status, search } = req.query;
    const where: any = {};

    if (species && typeof species === 'string') {
      where.species = species;
    }
    if (status && typeof status === 'string') {
      where.status = status;
    } else {
      // By default, only show available pets
      where.status = 'disponivel';
    }
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { breed: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pets = await prisma.pet.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(pets);
  } catch (err) {
    next(err);
  }
});

// Get pet by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }
    res.json(pet);
  } catch (err) {
    next(err);
  }
});

// Create a new pet (admin)
router.post('/', validate(createPetSchema), async (req: Request, res: Response, next: NextFunction) => {
  const { name, species, breed, age, price, description, imageUrl } = req.body;
  try {
    const pet = await prisma.pet.create({
      data: { name, species, breed, age, price, description, imageUrl },
    });
    res.status(201).json(pet);
  } catch (err) {
    next(err);
  }
});

// Update an existing pet
router.put('/:id', validate(updatePetSchema), async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const pet = await prisma.pet.update({
      where: { id },
      data: req.body,
    });
    res.json(pet);
  } catch (err) {
    next(err);
  }
});

// Delete a pet
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    await prisma.pet.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
