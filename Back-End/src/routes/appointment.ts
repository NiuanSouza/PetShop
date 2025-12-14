import express from 'express';
import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { createAppointmentSchema } from '../validation/appointmentSchema.js';

const router = express.Router();

router.use(authenticate as any);

// List my appointments
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.userId },
      include: { service: true, myPet: true },
      orderBy: { dateTime: 'desc' },
    });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
});

// Create appointment
router.post('/', validate(createAppointmentSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { serviceId, myPetId, dateTime, notes } = req.body;
  try {
    // Verify ownership of the pet
    const pet = await prisma.myPet.findFirst({ where: { id: myPetId, userId: req.userId } });
    if (!pet) return res.status(400).json({ error: 'Pet não encontrado ou não pertence a você' });

    // Check for time conflicts (same service, same hour)
    const dt = new Date(dateTime);
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return res.status(400).json({ error: 'Serviço não encontrado' });

    const startTime = new Date(dt);
    const endTime = new Date(dt.getTime() + service.duration * 60000);

    const conflict = await prisma.appointment.findFirst({
      where: {
        serviceId,
        status: { in: ['pendente', 'confirmado'] },
        dateTime: { gte: startTime, lt: endTime },
      },
    });
    if (conflict) {
      return res.status(409).json({ error: 'Já existe um agendamento nesse horário para este serviço' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: req.userId!,
        serviceId,
        myPetId,
        dateTime: dt,
        notes,
      },
      include: { service: true, myPet: true },
    });
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
});

// Update appointment status
router.patch('/:id/status', async (req: AuthRequest, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  try {
    const existing = await prisma.appointment.findFirst({ where: { id, userId: req.userId } });
    if (!existing) return res.status(404).json({ error: 'Agendamento não encontrado' });

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: { service: true, myPet: true },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Cancel (delete) appointment
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  try {
    const existing = await prisma.appointment.findFirst({ where: { id, userId: req.userId } });
    if (!existing) return res.status(404).json({ error: 'Agendamento não encontrado' });

    await prisma.appointment.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
