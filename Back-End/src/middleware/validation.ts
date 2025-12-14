import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

/**
 * Middleware factory que valida req.body contra um schema Zod.
 * Se a validação falhar, responde com 400 e mensagem em português.
 * Compatível com Zod v4 (usa result.error.issues em vez de result.error.errors)
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e: any) => e.message).join(', ');
      return res.status(400).json({ error: `Dados inválidos: ${errors}` });
    }
    req.body = result.data;
    next();
  };
};
