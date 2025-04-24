// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

/**
 * Middleware для проверки accessToken из заголовка Authorization.
 * Если токен отсутствует или неверен, отдает 401 и прерывает дальнейшую обработку.
 */
export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token missing" });

    return;
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      id: number;
    };

    req.userId = payload.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
}
