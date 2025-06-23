import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    username: string;
    role: 'admin' | 'leader' | 'employee';
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided or invalid format' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secret') as JwtPayload;
    if (!decoded || typeof decoded !== 'object' || !decoded._id || !decoded.username || !decoded.role || !['admin', 'leader', 'employee'].includes(decoded.role)) {
      res.status(401).json({ message: 'Invalid token structure' });
      return;
    }
    req.user = decoded as AuthRequest['user'];
    next();
  } catch (error) {
    const err = error as VerifyErrors;
    let message = 'Invalid or expired token';
    if (err.name === 'TokenExpiredError') message = 'Token has expired';
    else if (err.name === 'JsonWebTokenError') message = 'Invalid token signature';
    res.status(401).json({ message });
    return;
  }
};

export const roleMiddleware = (roles: ('admin' | 'leader' | 'employee')[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  if (!req.user._id || !req.user.username || !req.user.role) {
    res.status(500).json({ message: 'Invalid user data' });
    return;
  }
  if (!roles.includes(req.user.role)) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }
  next();
};