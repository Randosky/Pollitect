/**
 * Добавляет к строке id опроса
 * @param {string} str - строка
 * @returns {string} строка с добавленным surveyId
 */
export function addIdToString(str: string, surveyId: number): string {
  return `${str}-${surveyId}`;
}
