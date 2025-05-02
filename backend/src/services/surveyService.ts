import crypto from "crypto";

/** Генерирует уникальный id для вопроса */
export function getRandomId(): number {
  // 53‑битное случайное целое (безопасно помещается в JS‑Number)
  return Number.parseInt(crypto.randomBytes(8).toString("hex"), 16) >>> 0;
}

/** Проставляем уникальные id вопросам */
export function ensureQuestionIds<T extends { id?: number }>(
  questions: T[]
): T[] {
  return questions.map((q) => ({
    ...q,
    id: q.id ?? getRandomId(),
  }));
}
