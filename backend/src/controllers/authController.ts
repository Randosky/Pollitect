import { Request, Response } from "express";

import jwt from "jsonwebtoken";
import db from "../models";
import {
  generateTokens,
  saveRefreshTokenToCookie,
} from "../services/authService";

const { User } = db;

/**
 * Регистрация пользователя
 *
 * @param {Request} req - запрос
 * @param {Response} res - ответ
 *
 * @returns {Promise<void>} - ответ с данными зарегистрированного пользователя
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

    const newUser = await User.create({ name, email, password });

    const { accessToken, refreshToken } = generateTokens({ id: newUser.id });

    // Сохраняем refreshToken в БД, чтобы трекать активные сессии
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Сохраняем refreshToken в куку
    saveRefreshTokenToCookie(res, refreshToken);

    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      accessToken,
      refreshToken,
    });

    return;
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ message: "Ошибка сервера" });

    return;
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

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });

      return;
    }

    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Неверный пароль" });

      return;
    }

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokens({ id: user.id });

    // Сохраняем refreshToken в БД, чтобы трекать активные сессии
    user.refreshToken = refreshToken;
    await user.save();

    // Сохраняем refreshToken в куку
    saveRefreshTokenToCookie(res, refreshToken);

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });

    return;
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({ message: "Ошибка сервера" });

    return;
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
    const userData: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    );
    const user = await User.findByPk(userData.id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({ message: "Неверный refresh токен" });

      return;
    }

    // Генерация новых токенов
    const tokens = generateTokens({ id: user.id });

    // Обновляем refreshToken в БД
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Сохраняем refreshToken в куку
    saveRefreshTokenToCookie(res, refreshToken);

    res.status(200).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return;
  } catch (error) {
    console.error("Ошибка при обновлении токена:", error);

    res.status(403).json({ message: "Неверный refresh токен" });

    return;
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
    const userData: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    );
    const user = await User.findByPk(userData.id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({ message: "Неверный refresh токен" });

      return;
    }

    // Обнуляем refreshToken в базе данных
    user.refreshToken = null;
    await user.save();

    // Удаляем refreshToken из куки
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Выход выполнен успешно" });

    return;
  } catch (error) {
    console.error("Ошибка при выходе:", error);
    res.status(500).json({ message: "Ошибка сервера" });

    return;
  }
};
