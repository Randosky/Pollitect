import { getCookie } from "@services/CookieService";
import randomId from "@utils/getRandomId";
import { OWNER, SERVER_URL_WIDGET } from "@widget/vars";
import "core-js";
import "regenerator-runtime/runtime";

import { ISurvey } from "@widget/Survey.types";

// import mockSurvey from "./mockSurvey";
import Survey from "./widget/Survey";

declare global {
  interface Window {
    _pollitect: Survey;
  }
}

/** Находит <script src="...pollitect.js" data-user="..."> */
function getPollitectScript(): HTMLScriptElement {
  const script = document.querySelector<HTMLScriptElement>('script[src*="pollitect.js"]');

  if (!script) throw new Error("Не найден скрипт pollitect.js");

  return script;
}

/** Извлекает data-user из тега <script> */
function getUserId(script: HTMLScriptElement): string {
  const userId = script.dataset.user;

  if (!userId) throw new Error("У скрипта нет data-user");

  return userId;
}

/** Загружает JSON-описание опроса с бэка */
async function loadSurveyData(userId: string): Promise<ISurvey[]> {
  const resp = await fetch(
    `${SERVER_URL_WIDGET}?userId=${encodeURIComponent(userId)}&url=${encodeURIComponent(window.location.origin)}`,
    { method: "GET" }
  );

  if (!resp.ok) throw new Error(`Ошибка при загрузке: ${resp.status}`);

  return (await resp.json()) as ISurvey[];
}

/** Проверяет, можно ли показывать опрос (по куке и настройке prevent_repeat) */
function shouldPrevent(survey: ISurvey): boolean {
  const surveyId = survey.id!;
  const prevent = survey.display_settings.prevent_repeat;
  const done = getCookie(`${OWNER}-${surveyId}-completed`) === "true";

  return prevent && done;
}

/** Возвращает sessionId из sessionStorage или создаёт новый и сохраняет */
function getSessionIdForSurvey(surveyId: number): number {
  const key = `${OWNER}-${surveyId}-session`;
  const raw = sessionStorage.getItem(key);
  const existing = raw ? Number(raw) : NaN;

  if (!existing || isNaN(existing)) {
    const next = randomId();

    sessionStorage.setItem(key, next.toString());

    return next;
  }

  return existing;
}

/** Находит DOM-элемент, куда будем монтировать виджет */
function getContainer(id: string): HTMLElement {
  const c = document.getElementById(id);

  if (!c) throw new Error(`Элемент с id '${id}' не найден`);

  return c;
}

/**
 * Создаёт инстанс Survey, рендерит и вкладывает в DOM в зависимости
 * от настройки design_settings.placement:
 * — "inbuilt" (встроенный): внутрь контейнера
 * — "after": сразу после контейнера
 * — "before": сразу перед контейнером
 */
function mountSurvey(surveyData: ISurvey, sessionId: number, container: HTMLElement): void {
  /** создаём и инициализируем Survey */
  const surveyInstance = new Survey(surveyData, sessionId);

  window._pollitect = surveyInstance;

  const surveyEl = surveyInstance.surveyElement;

  if (!surveyEl) return;

  // определяем способ вставки
  switch (surveyData.design_settings.placement) {
    case "after":
      /** после — ставим элемент сразу после контейнера */
      container.insertAdjacentElement("afterend", surveyEl);
      break;

    case "before":
      /** до — ставим элемент сразу перед контейнером */
      container.insertAdjacentElement("beforebegin", surveyEl);
      break;

    case "inbuilt":

    default:
      /** встроенный — помещаем внутрь контейнера */
      container.appendChild(surveyEl);
  }
}

/** Основная точка входа */
async function initSurvey() {
  try {
    const script = getPollitectScript();
    const userId = getUserId(script);
    const surveys = await loadSurveyData(userId);

    surveys.forEach(survey => {
      if (shouldPrevent(survey)) return;

      const sessionId = getSessionIdForSurvey(survey.id!);
      const container = getContainer(survey.display_settings.target_id);

      mountSurvey(survey, sessionId, container);
    });
  } catch (err) {
    console.error("initSurvey error:", err);
  }
}

document.addEventListener("DOMContentLoaded", initSurvey);
