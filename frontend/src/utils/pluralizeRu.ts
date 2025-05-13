/* eslint-disable no-magic-numbers */
/**
 * Функция для конвертирования слова по склонениям в зависимости от числа.
 *
 * @param {number} value - Значение по которому нужно склонять слово.
 * @param {string[]} words - Массив слов, состоящий из 3-х значений.
 * @returns {string} - Склоненное слово.
 *
 * @example
 * - (1, ["лид", "лида", "лидов"]) - Вернет `лид`
 * - (2, ["лид", "лида", "лидов"]) - Вернет `лида`
 * - (10, ["лид", "лида", "лидов"]) - Вернет `лидов`
 */
export default function (value: number, words: string[]): string {
  value = Math.abs(value) % 100;
  const num = value % 10;

  if (value > 10 && value < 20) return words[2];

  if (num > 1 && num < 5) return words[1];

  if (num === 1) return words[0];

  return words[2];
}
