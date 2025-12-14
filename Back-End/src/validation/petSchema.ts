import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(1, { message: 'Nome não pode ser vazio' }),
  species: z.string().min(1, { message: 'Espécie é obrigatória' }),
  breed: z.string().optional(),
  age: z.number().int().nonnegative({ message: 'Idade não pode ser negativa' }).optional(),
  price: z.number().nonnegative({ message: 'Preço não pode ser negativo' }),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: 'URL da imagem inválida' }).optional(),
});

export const updatePetSchema = createPetSchema.partial();
