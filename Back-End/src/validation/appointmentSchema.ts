import { z } from 'zod';

export const createAppointmentSchema = z.object({
  serviceId: z.coerce.number().int().positive({ message: 'ID do serviço inválido' }),
  myPetId: z.coerce.number().int().positive({ message: 'ID do pet inválido' }),
  dateTime: z.string().min(1, { message: 'Data e hora são obrigatórias' }),
  notes: z.string().optional(),
});
