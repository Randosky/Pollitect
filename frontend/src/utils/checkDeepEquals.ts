/* eslint-disable sonarjs/cognitive-complexity */
/** Тип настроек для сравнения объектов */
export type TCheckDeepEqualsOptions = {
  /** Поля которые игнорируются при проверке */
  fieldsToIgnore?: TFieldToIgnore[];
};

/** Поле которое игнориуется при проверке */
type TFieldToIgnore = {
  /** Название поля */
  field: string;
  /** Значения при которых поле будет игнорироваться */
  values?: unknown[];
};

/** Функция для проверки элемента на DOM
 * @param {unknown} obj - Объект для проверки
 * @returns {boolean} Объект является частью DOM?
 */
function isDOMElement(obj: unknown): obj is Element | Document {
  return obj instanceof Element || obj instanceof Document;
}

/**
 * Конвертируем структуру Map в обычный объект.
 * @param {Map<unknown, unknown>} obj - Map
 * @returns {unknown} Объект с парой ключ-значение из Map
 */
function convertMapToObject(obj: Map<unknown, unknown>): unknown {
  return Object.fromEntries(obj);
}

/**
 * Конвертируем структуру Set в обычный массив.
 * @param {Set<unknown>} obj - Set
 * @returns {unknown[]} Массив элементов из Set
 */
function convertSetToArray(obj: Set<unknown>): unknown[] {
  return Array.from(obj);
}

/**
 * Убирает из объекта поля, входящие в fieldsToIgnore.
 * @param {object} object - Объект для фильтрации.
 * @param {Array<TFieldToIgnore>} fieldsToIgnore - Поля, которые убираются из объекта.
 * @return {Array<string>} - Массив ключей объекта, оставшихся после фильтрации.
 */
function filterObjectKeys(object: object, fieldsToIgnore: Array<TFieldToIgnore>): Array<string> {
  return Object.keys(object).filter(key => {
    const valueA = (object as Record<string, unknown>)[key];

    const ignoreRule = fieldsToIgnore.find(rule => rule.field === key);

    return ignoreRule?.values
      ? !ignoreRule?.values?.includes(valueA)
      : !Object.keys(object).includes(ignoreRule?.field || "");
  });
}

/**
 * Функция для глубокого сравнения двух объектов
 * @param {T} objectA - Первый объект для сравнения
 * @param {T} objectB - Второй объект для сравнения
 * @param {TCheckDeepEqualsOptions} options - Опции для сравнивания
 * @returns {boolean} Равны ли объекты друг другу, `true` если равны
 */
export default function checkDeepEquals<T>(objectA: T, objectB: T, options: TCheckDeepEqualsOptions = {}): boolean {
  const { fieldsToIgnore = [] } = options;

  /** Создаем стек пар объектов */
  const stack: [unknown, unknown][] = [[objectA, objectB]];

  while (stack.length > 0) {
    const [currentA, currentB] = stack.pop()!;

    /** Продолжаем, если значения или ссылки равны */
    if (currentA === currentB) continue;

    /** Сравниваем только объекты, кроме null */
    if (
      currentA === null ||
      currentB === null ||
      typeof currentA !== "object" ||
      typeof currentB !== "object" ||
      isDOMElement(currentA) ||
      isDOMElement(currentB)
    ) {
      return false;
    }

    /** Обработка массивов */
    if (Array.isArray(currentA) && Array.isArray(currentB)) {
      if (currentA.length !== currentB.length) return false;

      for (let i = 0; i < currentA.length; i++) {
        stack.push([currentA[i], currentB[i]]);
      }
      continue;
    }

    /** Обработка Set */
    if (currentA instanceof Set && currentB instanceof Set) {
      if (currentA.size !== currentB.size) return false;

      const setEqual = checkDeepEquals(convertSetToArray(currentA), convertSetToArray(currentB), options);

      if (!setEqual) return false;

      continue;
    }

    /** Обработка Map */
    if (currentA instanceof Map && currentB instanceof Map) {
      if (currentA.size !== currentB.size) return false;

      const mapEqual = checkDeepEquals(convertMapToObject(currentA), convertMapToObject(currentB), options);

      if (!mapEqual) return false;

      continue;
    }

    const keysA = filterObjectKeys(currentA, fieldsToIgnore);

    const keysB = filterObjectKeys(currentB, fieldsToIgnore);

    /** Разное количество ключей */
    if (keysA.length !== keysB.length) {
      return false;
    }

    /** Добавляем пары объектов для сравнения в стек */
    for (const key of keysA) {
      if (!keysB.includes(key)) {
        return false;
      }

      /** Кладем в стек значения объектов по ключам */
      stack.push([(currentA as Record<string, unknown>)[key], (currentB as Record<string, unknown>)[key]]);
    }
  }

  return true;
}
