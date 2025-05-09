/* eslint-disable no-magic-numbers */
/**
 * Коэффициент для вычисления относительной яркости (luma) для красного канала,
 * согласно ITU-R BT.709, используемому в HD-видео.
 */
const ITU_LUMA_R = 0.299;

/**
 * Коэффициент для вычисления относительной яркости (luma) для зелёного канала,
 * согласно ITU-R BT.709, используемому в HD-видео.
 */
const ITU_LUMA_G = 0.587;

/**
 * Коэффициент для вычисления относительной яркости (luma) для синего канала,
 * согласно ITU-R BT.709, используемому в HD-видео.
 */
const ITU_LUMA_B = 0.114;

/**
 * Пороговая яркость, при которой цвет считается «тёмным». Это значение
 * было выбрано эмпирически.
 */
const DARK_THRESHOLD = 128;

/** Проверка «тёмный ли» цвет (формат #rrggbb / #rgb). */
export const isDarkColor = (hex: string): boolean => {
  const n = hex.startsWith("#") ? hex.slice(1) : hex;

  const [r, g, b] =
    n.length === 3
      ? [...n].map(c => parseInt(c + c, 16))
      : [n.slice(0, 2), n.slice(2, 4), n.slice(4, 6)].map(h => parseInt(h, 16));

  const luma = ITU_LUMA_R * r + ITU_LUMA_G * g + ITU_LUMA_B * b;

  return luma < DARK_THRESHOLD;
};
