import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export interface AuthRequest extends Request {
  userId?: number;
}

/**
 * Verifica o token no formato "userId:hmac-sha256"
 * (gerado pelo route auth.ts com createToken)
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = (req as any).headers?.authorization as string | undefined;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente ou inválido' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const [userIdStr, sig] = token.split(':');
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(userIdStr).digest('hex');
    if (sig !== expected) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.userId = Number(userIdStr);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
