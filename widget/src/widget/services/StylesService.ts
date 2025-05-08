/* eslint-disable no-magic-numbers */
import { TDesignSettings, TFontFamily } from "@/widget/Survey.types";

import { OWNER } from "@/widget/vars";

const STYLE_ID = `${OWNER}-style`;
const FONT_STYLE_ID = `${OWNER}-fonts`;

const FONT_FILES: Record<TFontFamily, string[]> = {
  Arial: ["ARIAL.TTF", "ARIALI.TTF", "ARIALBD.TTF", "ARIALBI.TTF"],
  Inter: [
    "Inter_24pt-Regular.ttf",
    "Inter_24pt-Bold.ttf",
    "Inter_24pt-Light.ttf",
    "Inter_24pt-Medium.ttf",
    "Inter_24pt-SemiBold.ttf",
  ],
  Roboto: ["Roboto-Regular.ttf", "Roboto-Bold.ttf", "Roboto-Light.ttf", "Roboto-Medium.ttf", "Roboto-Black.ttf"],
  Montserrat: ["Montserrat-Regular.ttf", "Montserrat-Bold.ttf", "Montserrat-Medium.ttf", "Montserrat-Light.ttf"],
  "Open Sans": ["OpenSans-Regular.ttf", "OpenSans-Bold.ttf", "OpenSans-SemiBold.ttf", "OpenSans-Light.ttf"],
  "Times New Roman": ["times.ttf"],
};

/**
 * Инициализирует пользовательские переменные и шрифты для виджета
 * @param {TDesignSettings} settings - Дизайн настройки виджета
 * @returns {void}
 */
export function injectWidgetStyles(settings: TDesignSettings): void {
  injectColorVariables(settings);
  injectFontStyles(settings.font_family);
}

/**
 * Добавляет в document глобальные переменные цветов
 * @param {TDesignSettings} settings
 */
function injectColorVariables(settings: TDesignSettings): void {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");

  style.id = STYLE_ID;

  style.innerHTML = `
    :root {
      --${OWNER}-font-family: '${settings.font_family}', sans-serif;
      --${OWNER}-text-color: ${settings.text_color};
      --${OWNER}-bg-color: ${settings.background_color};
      --${OWNER}-btn-color: ${settings.button_color};
    }
  `;

  document.head.appendChild(style);
}

/**
 * Добавляет @font-face для выбранного шрифта
 * @param {TFontFamily} fontFamily
 */
function injectFontStyles(fontFamily: TFontFamily): void {
  if (document.getElementById(FONT_STYLE_ID)) return;

  const fonts = FONT_FILES[fontFamily];
  const style = document.createElement("style");

  style.id = FONT_STYLE_ID;

  style.innerHTML = fonts
    .map(file => {
      const weight = detectFontWeight(file);
      const italic = file.toLowerCase().includes("italic") || file.toLowerCase().includes("i.ttf");

      return `
        @font-face {
          font-family: "${fontFamily}";
          src: url("http://localhost:3000/fonts/${fontFamily.toLowerCase().replace(/\s/g, "-")}/${file}") format("truetype");
          font-weight: ${weight};
          font-style: ${italic ? "italic" : "normal"};
          font-display: swap;
        }
      `;
    })
    .join("\n");

  document.head.appendChild(style);
}

/**
 * Простая эвристика определения веса шрифта по названию файла
 */
function detectFontWeight(filename: string): number {
  const name = filename.toLowerCase();

  if (name.includes("thin")) return 100;

  if (name.includes("extralight")) return 200;

  if (name.includes("light")) return 300;

  if (name.includes("regular")) return 400;

  if (name.includes("medium")) return 500;

  if (name.includes("semibold")) return 600;

  if (name.includes("bold")) return 700;

  if (name.includes("extrabold")) return 800;

  if (name.includes("black")) return 900;

  return 400;
}
