import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';
import { errorResponse } from '../utils/response';

export interface JwtUserPayload extends DefaultJwtPayload {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtUserPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        errorResponse(res, null, 'Akses token diperlukan', 401, 'TOKEN_REQUIRED');
        return; 
    }

    jwt.verify(token, process.env.AUTH_SECRET as string, (err, decoded) => {
        if (err) {
            errorResponse(res, err, 'Toked salah atau kadaluarsa', 403, 'INVALID_TOKEN');
            return;
        }
        req.user = decoded as JwtUserPayload;
        next();
    });
};