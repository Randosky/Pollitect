import "core-js";
import "regenerator-runtime/runtime";

// import mockSurvey from "./mockSurvey";
import Survey from "./widget/Survey";

declare global {
  interface Window {
    _pollitect: Survey;
  }
}

async function initSurvey() {
  const script = document.querySelector<HTMLScriptElement>('script[src*="pollitect.js"]');

  if (!script) {
    console.error("Не найден скрипт pollitect.js");

    return;
  }

  // получаем атрибут data-user
  const userId = script.dataset.user;

  if (!userId) {
    console.error("У скрипта нет data-user");

    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3000/api/widget?userId=" + userId + "&url=" + window.location.origin,
      { method: "GET" }
    );
    const data = await response.json();
    // const data = mockSurvey;

    const containerId = data?.display_settings?.target_id;
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`Элемент с id '${containerId}' не найден`);

      return;
    }

    /** Инициализируем опрос */
    const surveyInstance = new Survey(data);

    window._pollitect = surveyInstance;

    /** Добавляем опрос в контейнер */
    if (surveyInstance.surveyElement) {
      container.appendChild(surveyInstance.surveyElement);
    }
  } catch (error) {
    console.error("Failed to load survey data:", error);
  }
}

document.addEventListener("DOMContentLoaded", initSurvey);
