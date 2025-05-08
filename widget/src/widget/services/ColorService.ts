/* eslint-disable */

/**
 * Проверяет, является ли строка допустимым шестнадцатеричным цветом.
 * @param {string} hex - Строка для проверки.
 * @returns {boolean} - Возвращает true, если строка является допустимым шестнадцатеричным цветом, иначе false.
 */
const isValidHex = (hex: string): boolean => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);

/**
 * Конвертирует значение шестнадцатеричного числа в диапазоне от 0 до 255.
 * @param {string} hexStr - Шестнадцатеричное число.
 * @returns {number} - Конвертированное значение.
 */
const convertHexUnitTo256 = (hexStr: string): number => parseInt(hexStr.repeat(2 / hexStr.length), 16);

/**
 * Вычисляет значение альфа-канала в диапазоне от 0 до 1.
 * @param {number} a - Значение альфа-канала в диапазоне от 0 до 255.
 * @param {number} alpha - Значение альфа-канала в диапазоне от 0 до 1.
 * @returns {number} - Вычисленное значение альфа-канала в диапазоне от 0 до 1.
 */
const getAlphaFloat = (a: number | undefined, alpha: number | undefined): number => {
  if (typeof a !== "undefined") return a / 255;
  else if (typeof alpha === "number" && alpha >= 0 && alpha <= 1) return alpha;
  else return 1;
};

/**
 * Преобразует шестнадцатеричный цвет в строку формата RGBA.
 * @param {string} hex - Шестнадцатеричный цвет.
 * @param {number} [alpha=1] - Прозрачность (альфа-канал). По умолчанию 1.
 * @param {boolean} [returnArray=false] - Если true, вернет массив чисел, иначе строку RGBA. По умолчанию false.
 * @returns {(string | number[])} - Строка формата RGBA или массив чисел (в зависимости от параметра returnArray).
 */
export const hexToRGBA = (hex: string, alpha: number = 1, returnArray: boolean = false): string | number[] => {
  if (!isValidHex(hex)) return hex;

  /** Длина каждого фрагмента шестнадцатеричного значения. */
  const chunkSize: number = Math.floor((hex.length - 1) / 3);
  const [r, g, b, a] =
    hex
      .slice(1)
      .match(new RegExp(`.{${chunkSize}}`, "g"))
      ?.map(convertHexUnitTo256) ?? [];

  const alphaFloat: number = getAlphaFloat(a, alpha);

  return returnArray ? [r, g, b, alphaFloat] : `rgba(${r}, ${g}, ${b}, ${alphaFloat})`;
};

/**
 * Определяет контрастный цвет (светлый или тёмный) для заданного RGB цвета.
 * @param {number[]} color - Массив из трёх чисел, представляющих RGB компоненты цвета [r, g, b]
 * @returns {"light" | "dark"} - Возвращает "light" для светлых цветов и "dark" для тёмных
 * @example
 * getContrast([255, 255, 255]) // returns "light"
 * getContrast([0, 0, 0]) // returns "dark"
 */
export const getContrast = (color: number[]): "light" | "dark" => {
  const [r, g, b] = color;

  return typeof r === "undefined" ||
    typeof g === "undefined" ||
    typeof b === "undefined" ||
    1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
    ? "light"
    : "dark";
};

export const increaseBrightness = (hex: string, percent: number): string => {
  hex = hex.replace(/^\s*#|\s*$/g, "");

  if (hex.length === 3) hex = hex.replace(/(.)/g, "$1$1");

  const r: number = parseInt(hex.substr(0, 2), 16);
  const g: number = parseInt(hex.substr(2, 2), 16);
  const b: number = parseInt(hex.substr(4, 2), 16);

  return (
    "#" +
    (0 | ((1 << 8) + r + ((256 - r) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + g + ((256 - g) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + b + ((256 - b) * percent) / 100)).toString(16).substr(1)
  );
};

export const componentToHex = (c: number): string => {
  const hex: string = c.toString(16);

  return hex.length === 1 ? "0" + hex : hex;
};

export const rgbToHex = (color: [number, number, number]): string => {
  return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
};

/**
 * Проверяет, является ли цвет белым.
 * @param {string} color - Цвет в формате RGB.
 * @returns {boolean} - Возвращает true, если цвет белый, иначе false.
 */
export const isWhiteColor = (color: string): boolean => {
  return ["#fff", "#ffffff"].includes(color.toLocaleLowerCase());
};
