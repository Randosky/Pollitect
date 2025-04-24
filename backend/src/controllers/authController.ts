import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../models";
import {
  generateTokens,
  saveRefreshTokenToCookie,
} from "../services/authService";
import { IUser } from "../models/user";

const { User } = db;

/**
 * Регистрация пользователя
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
      return;
    }

    const newUser = await User.create({ name, email, password, role: "user" });
    const { accessToken, refreshToken } = generateTokens({ id: newUser.id });

    newUser.refreshToken = refreshToken;
    await newUser.save();
    saveRefreshTokenToCookie(res, refreshToken);

    // Собираем только необходимые поля
    const user: IUser = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name || undefined,
      phone: newUser.phone || undefined,
    };

    res.status(200).json({ user, accessToken });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ message: "Ошибка при регистрации" });
  }
};

/**
 * Обработка входа пользователя.
 *
 * Извлекает эл. почту и пароль из тела запроса, проверяет наличие пользователя с
 * указанной эл. почтой и валидирует пароль. Если пользователь найден и пароль
 * корректный, генерирует и возвращает access и refresh токены, обновляя
 * refreshToken в базе данных. В случае неуспеха возвращает соответствующую
 * ошибку.
 *
 * @param {Request} req - объект запроса Express
 * @param {Response} res - объект ответа Express
 * @returns {Promise<void>} - ответ с данными пользователя и токенами или
 * сообщение об ошибке
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const userRecord = await User.findOne({ where: { email } });
    if (!userRecord) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    const isMatch = await userRecord.validatePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Неверный пароль" });
      return;
    }

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokens({ id: userRecord.id });

    // Сохраняем refreshToken в БД, чтобы трекать активные сессии
    userRecord.refreshToken = refreshToken;
    await userRecord.save();

    // Сохраняем refreshToken в куку
    saveRefreshTokenToCookie(res, refreshToken);

    const user: IUser = {
      id: userRecord.id,
      email: userRecord.email,
      role: userRecord.role,
      name: userRecord.name || undefined,
      phone: userRecord.phone || undefined,
    };

    res.status(200).json({ user, accessToken });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

/**
 * Обновление токена доступа
 *
 * @param {Request} req - объект запроса Express
 * @param {Response} res - объект ответа Express
 * @returns {Promise<void>} - ответ с обновленными токенами или
 * сообщение об ошибке
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    // Извлекаем refreshToken из куки
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(400).json({ message: "Токен отсутствует" });
      return;
    }

    // Находим пользователя по декодированию токена
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: number };

    const userRecord = await User.findByPk(payload.id);

    if (!userRecord || userRecord.refreshToken !== refreshToken) {
      res.status(403).json({ message: "Неверный refresh токен" });
      return;
    }

    // Генерация новых токенов
    const tokens = generateTokens({ id: userRecord.id });

    // Обновляем refreshToken в БД
    userRecord.refreshToken = tokens.refreshToken;
    await userRecord.save();

    // Сохраняем refreshToken в куку
    saveRefreshTokenToCookie(res, refreshToken);

    res.status(200).json({ accessToken: tokens.accessToken });
  } catch (error) {
    console.error("Ошибка при обновлении токена:", error);
    res.status(403).json({ message: "Неверный refresh токен" });
  }
};

/**
 * Выполняет выход пользователя, обнуляя его refreshToken.
 *
 * Извлекает идентификатор пользователя из middleware, ищет пользователя
 * в базе данных и обнуляет его refreshToken. Если пользователь не найден,
 * возвращает ошибку 404. При успешном выходе возвращает сообщение об
 * успешном выполнении. В случае ошибки возвращает сообщение об ошибке сервера.
 *
 * @param {Request} req - объект запроса Express
 * @param {Response} res - объект ответа Express
 * @returns {Promise<Response>} - промис, который разрешается после обработки
 * запроса с соответствующим сообщением.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Извлекаем refreshToken из куки
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(400).json({ message: "Токен отсутствует" });
      return;
    }

    // Находим пользователя по декодированию токена
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: number };

    const userRecord = await User.findByPk(payload.id);

    if (!userRecord || userRecord.refreshToken !== refreshToken) {
      res.status(403).json({ message: "Неверный refresh токен" });
      return;
    }

    // Обнуляем refreshToken в базе данных
    userRecord.refreshToken = null;
    await userRecord.save();

    // Удаляем refreshToken из куки
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Выход выполнен успешно" });
  } catch (error) {
    console.error("Ошибка при выходе:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
