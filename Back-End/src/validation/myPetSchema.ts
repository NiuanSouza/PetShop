import { z } from 'zod';

export const createMyPetSchema = z.object({
  name: z.string().min(1, { message: 'Nome do pet é obrigatório' }),
  species: z.string().min(1, { message: 'Espécie é obrigatória' }),
  breed: z.string().optional(),
  age: z.number().int().nonnegative().optional(),
  weight: z.number().nonnegative().optional(),
  imageUrl: z.string().url({ message: 'URL da imagem inválida' }).optional(),
  notes: z.string().optional(),
});

export const updateMyPetSchema = createMyPetSchema.partial();
