/* eslint-disable no-magic-numbers */
import { isDarkColor } from "@utils/isDarkColor";

import { TDesignSettings, TFontFamily } from "@/widget/Survey.types";

import { MOBILE_WIDTH, SERVER_URL } from "@/widget/vars";

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
export function injectWidgetStyles(owner: string, settings: TDesignSettings): void {
  injectColorVariables(owner, settings);
  injectFontStyles(owner, settings.font_family);
}

/**
 * Добавляет в document глобальные переменные цветов
 * @param {TDesignSettings} settings
 */
function injectColorVariables(owner: string, settings: TDesignSettings): void {
  const STYLE_ID = `${owner}-style`;

  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");

  style.id = STYLE_ID;

  style.innerHTML = `
    :root {
      --${owner}-secondary-bg-color: #f2f0f0;

      --${owner}-font-family: '${owner}-${settings.font_family}', sans-serif;
      --${owner}-text-color: ${settings.text_color};
      --${owner}-bg-color: ${settings.background_color};
      --${owner}-btn-bg-color: ${settings.button_color};
      --${owner}-btn-color: ${isDarkColor(settings.button_color) ? "#fcfcfc" : "#222"};

      --${owner}-font-size-hint: 12px;
      --${owner}-font-size-header: 20px;
      --${owner}-font-size-description: 14px;
      --${owner}-font-size-button: 14px;
      --${owner}-font-size-legal-info: 12px;
    }

    @media (min-width: ${MOBILE_WIDTH}px) {
      :root {
        --${owner}-font-size-header: 22px;
        --${owner}-font-size-description: 15px;
        --${owner}-font-size-button: 15px;
      }
    }
  `;

  document.head.appendChild(style);
}

/**
 * Добавляет @font-face для выбранного шрифта
 * @param {TFontFamily} fontFamily
 */
function injectFontStyles(owner: string, fontFamily: TFontFamily): void {
  const FONT_STYLE_ID = `${owner}-fonts`;

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
          font-family: "${owner}-${fontFamily}";
          src: url("${SERVER_URL}/fonts/${fontFamily.toLowerCase().replace(/\s/g, "-")}/${file}") format("truetype");
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
