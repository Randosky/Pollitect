/**
 * Проверка формы на пустоту значений полей. Если поля не являются объектом,
 * функция возвращает true.
 *
 * @param {unknown} fields - Поля для проверки
 * @returns {boolean} True, если все поля валидны, false в противном случае
 */
export function validateEmptyFields(fields: unknown): boolean {
  if (typeof fields !== "object" || fields === null) {
    return true;
  }

  return Object.values(fields).every((value: unknown) => {
    if (typeof value === "string") {
      return value.trim() !== "";
    }

    if (typeof value === "object") {
      return validateEmptyFields(value);
    }
  });
}
