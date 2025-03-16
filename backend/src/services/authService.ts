import { Response } from "express";

import jwt from "jsonwebtoken";

/**
 * Сохраняет refreshToken в куке
 *
 * @param {Response} res - объект ответа Express
 * @param {string} refreshToken - токен для обновления
 */
export const saveRefreshTokenToCookie = (
  res: Response,
  refreshToken: string
) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Доступен только на сервере
    secure: process.env.NODE_ENV === "production", // Только по HTTPS, если продакшн
    sameSite: "strict", // Защищаем куку от CSRF атак
    maxAge: 30 * 24 * 60 * 60 * 1000, // Время жизни куки (30 дней)
  });
};

type StringValue = `${number}${"d" | "m"}`;

/**
 * Генерируем refreshToken и accessToken
 *
 * @param {{id: string}} payload - объект с id пользователя, по которому строим токены
 * @returns {{ accessToken: string, refreshToken: string } } токен для обновления и токен для доступа
 */
export const generateTokens = (
  payload: object
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES as StringValue) || "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES as StringValue) || "30d",
  });

  return { accessToken, refreshToken };
};
