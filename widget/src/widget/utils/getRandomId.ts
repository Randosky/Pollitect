/* eslint-disable sonarjs/pseudo-random */
/** Функция для генерации рандомного айди
 * @returns {string} - рандомный айди
 */
export default function randomId() {
  return (
    Math.floor(Math.random() * Math.floor(Math.random() * Date.now())) +
    Date.now() +
    // eslint-disable-next-line no-magic-numbers
    Math.floor(100000 + Math.random() * 900000)
  );
}
