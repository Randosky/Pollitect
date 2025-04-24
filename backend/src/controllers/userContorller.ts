import { Request, Response } from "express";
import db from "../models";
import { IUser } from "../models/user";

const { User } = db;

/**
 * Контроллер выдачи настроек (данных) пользователя.
 * req.userId устанавливается в authMiddleware.
 */
export async function getUser(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const userRecord = await User.findByPk(req.userId, {
      attributes: ["id", "email", "role", "name", "phone"],
    });

    if (!userRecord) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user: IUser = {
      id: userRecord.id,
      email: userRecord.email,
      role: userRecord.role as "user" | "admin",
      name: userRecord.name || undefined,
      phone: userRecord.phone || undefined,
    };

    res.status(200).json({ user });
  } catch (error) {
    console.error("getUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
