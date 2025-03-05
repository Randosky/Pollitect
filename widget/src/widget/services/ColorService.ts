import { colors } from "@widget/vars";

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
const getAlphaFloat = (a: number, alpha: number): number => {
  if (typeof a !== "undefined") {
    // eslint-disable-next-line no-magic-numbers
    return a / 255;
  } else if (typeof alpha === "number" && alpha >= 0 && alpha <= 1) {
    return alpha;
  }

  return 1;
};

/**
 * Преобразует шестнадцатеричный цвет в строку формата RGBA.
 * @param {string} hex - Шестнадцатеричный цвет.
 * @param {number} [alpha=1] - Прозрачность (альфа-канал). По умолчанию 1.
 * @param {boolean} [returnArray=false] - Если true, вернет массив чисел, иначе строку RGBA. По умолчанию false.
 * @returns {(string | number[])} - Строка формата RGBA или массив чисел (в зависимости от параметра returnArray).
 */

export const hexToRGBA = (hex: string, alpha: number = 1) => {
  if (!isValidHex(hex)) return hex;

  /** Длина каждого фрагмента шестнадцатеричного значения. */
  // eslint-disable-next-line no-magic-numbers
  const chunkSize = Math.floor((hex.length - 1) / 3);
  const matchReg = hex.slice(1).match(new RegExp(`.{${chunkSize}}`, "g"));

  if (!matchReg) return hex;

  const [r, g, b, a] = matchReg.map(convertHexUnitTo256);

  return [r, g, b, getAlphaFloat(a, alpha)];
};

/**
 * Возвращает цвет текста на основе заданного цвета.
 * @param {string} color - Массив цвета в формате hex.
 * @returns {string} - Возвращает цвет текста (строку).
 */
export const getColorText = (color: string): string => {
  const hex = hexToRGBA(color);
  let b, g, r;

  if (Array.isArray(hex)) [r, g, b] = hex;

  return typeof r === "undefined" ||
    typeof g === "undefined" ||
    typeof b === "undefined" ||
    // eslint-disable-next-line no-magic-numbers
    1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
    ? colors.light.text
    : colors.dark.text;
};

export type TParsedColor = {
  colors: string[];
  angle?: number;
  percentages?: number[];
};

/**
 * Парсит строку с цветами и возможным углом поворота и процентами.
 *
 * @param {string} input - Входная строка, содержащая один цвет в формате hex, rgba, или список цветов через запятую,
 *                         и опционально угол поворота и проценты.
 * @returns {TParsedColor} - Объект, содержащий массив цветов,
 * опционально угол поворота и массив процентов (если они присутствуют).
 */
export function parseColorString(input: string): TParsedColor {
  const colorRegex = /#(?:[0-9a-fA-F]{3}){1,2}(?:[0-9a-fA-F]{2})?/g;
  const angleRegex = /(\d{1,3})deg/g;
  const percentageRegex = /(\d{1,3}%)/g;

  const angle = input.match(angleRegex)?.map(s => Number(s.replace(/deg$/, "")))[0] || 0;
  const colors = input.match(colorRegex) || [];
  const percentages = input.match(percentageRegex)?.map(s => Number(s.replace(/\%$/, ""))) || [];

  return { colors, angle, percentages };
}

/** Опции для создания стиля заливки.*/
type TFillStyleOptions = {
  x: number;
  y: number;
  /** Угол на который повернут изначальный объект */
  rad: number;
  /** Цвета */
  color: TParsedColor;
  /** Ширина прямоугольника в который вписывается заливка */
  width: number;
};
/**
 * Создает стиль заливки для рисования на canvas, это может быть либо градиент, либо сплошной цвет.
 * @param {CanvasRenderingContext2D} ctx - Контекст рендеринга canvas.
 * @param {TFillStyleOptions} options - опции заливки.
 * @returns {CanvasGradient | string} - Стиль заливки, это может быть либо градиент, либо цветом.
 */
export function createFillStyle(ctx: CanvasRenderingContext2D, options: TFillStyleOptions): CanvasGradient | string {
  const { x, y, rad, color, width } = options;
  const startX = x;
  const startY = y;

  if (color.angle !== undefined && color.colors.length >= 2) {
    // eslint-disable-next-line no-magic-numbers
    const rotationAngle = (color.angle * Math.PI) / 180;
    const endX = rad ? width * Math.cos(rad + width / 2) : x + width;
    const endY = rad ? width * Math.sin(rad + width / 2) : y;

    // Рассчитываем центр линии (середина отрезка)
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;

    const rotatedStart = rotatePoint({ x: startX, y: startY, centerX, centerY, angle: rotationAngle });
    const rotatedEnd = rotatePoint({ x: endX, y: endY, centerX, centerY, angle: rotationAngle });
    const gradient = ctx.createLinearGradient(rotatedStart.x, rotatedStart.y, rotatedEnd.x, rotatedEnd.y);
    const step = 1 / (color.colors.length - 1);

    color.colors.forEach((_color, index) => {
      const maxPersantage = 100;

      gradient.addColorStop(
        color.percentages && color.percentages.length > 0 ? color.percentages[index] / maxPersantage : step * index,
        _color
      );
    });

    return gradient;
  }

  // Если нет угла, просто используем первый цвет
  return color.colors[0];
}

type TRotatePointParams = {
  /** X-начальной точки, которую нужно вращать. */
  x: number;
  /** Y-начальной точки, которую нужно вращать. */
  y: number;
  /** X-центра вокруг которого происходит поворот. */
  centerX: number;
  /** Y-центра вокруг которого происходит поворот. */
  centerY: number;
  /** Угол вращения в радианах. */
  angle: number;
};

/**
 * Вращает точку вокруг другой точки на заданный угол.
 *
 * @param {TRotatePointParams} params - Параметры для функции вращения точки.
 *
 * @returns {{ x: number, y: number }} Новые координаты точки после вращения.
 */
function rotatePoint(params: TRotatePointParams): { x: number; y: number } {
  const { x, y, centerX: cx, centerY: cy, angle } = params;
  const dx = x - cx;
  const dy = y - cy;

  return {
    x: cx + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: cy + dx * Math.sin(angle) + dy * Math.cos(angle),
  };
}

export function getGradientColor(color: string): string {
  return color.includes("deg") ? `linear-gradient(${color})` : color;
}
