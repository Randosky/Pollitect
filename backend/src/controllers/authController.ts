// import { Request, Response } from "express";
// import { User } from "../models/User"; // Твой sequelize User
// import {
//   hashPassword,
//   comparePasswords,
//   generateTokens,
// } from "../services/authService";

// export const register = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser)
//       return res.status(400).json({ message: "Пользователь уже существует" });

//     const hashedPassword = await hashPassword(password);
//     const newUser = await User.create({ email, password: hashedPassword });

//     const { accessToken, refreshToken } = generateTokens(newUser);

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
//     });

//     return res.json({ accessToken });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Ошибка регистрации" });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ where: { email } });
//     if (!user)
//       return res.status(400).json({ message: "Неверный email или пароль" });

//     const validPassword = await comparePasswords(password, user.password);
//     if (!validPassword)
//       return res.status(400).json({ message: "Неверный email или пароль" });

//     const { accessToken, refreshToken } = generateTokens(user);

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.json({ accessToken });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Ошибка входа" });
//   }
// };

// export const refresh = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.status(401).json({ message: "Нет refresh токена" });

//     const payload = verifyRefreshToken(token);
//     const user = await User.findByPk(payload.userId);
//     if (!user)
//       return res.status(401).json({ message: "Пользователь не найден" });

//     const { accessToken, refreshToken } = generateTokens(user);

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.json({ accessToken });
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: "Неавторизован" });
//   }
// };

// export const logout = (_req: Request, res: Response) => {
//   res.clearCookie("refreshToken");
//   res.status(200).json({ message: "Вы вышли из системы" });
// };
