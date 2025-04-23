/* eslint-disable no-magic-numbers */
/* eslint-disable camelcase */
import type { ISurvey, TSurveyTabs } from "./Survey.types";

export const SURVEY_TABS: TSurveyTabs[] = ["edit", "design", "settings"];

export const SURVEY_TABS_MAP: Record<TSurveyTabs, string> = {
  edit: "Конструктор",
  design: "Дизайн",
  settings: "Настройки",
};

/** Начальные (пустые) данные опроса при создании */
export const INITIAL_SURVEY: ISurvey = {
  questions: [],
  welcomeScreen: {
    active: false,
    button_text: "Начать",
    design_settings: { layout: "without_image", alignment: "left" },
  },
  personalScreen: {
    active: false,
    button_text: "Далее",
    design_settings: { layout: "without_image", alignment: "left" },
  },
  completionScreen: {
    active: false,
    button_text: "Завершить",
    design_settings: { layout: "without_image", alignment: "left" },
  },
  design_settings: {
    target_id: "",
    placement: "inbuilt",
    width: 100,
    width_unit: "%",
    height: 400,
    height_unit: "px",
    background_color: "#ffffff",
    text_color: "#000000",
    button_color: "#00bcd4",
    font_family: "Open Sans",
    margin: [16, 16, 16, 16],
    padding: [16, 16, 16, 16],
  },
  display_settings: {
    block_scroll: false,
    prevent_repeat: false,
    timer_sec: 0,
    url_match_mode: "contains",
    url_pattern: [window.location.origin],
  },
};

/** Пара примеров готовых опросов */
export const mockSurveys: ISurvey[] = [
  {
    id: 1,
    questions: [
      {
        order: 1,
        required: true,
        type: "single",
        title: "Как вам наш сервис?",
        description: "Оцените качество обслуживания",
        options: ["Отлично", "Хорошо", "Удовлетворительно", "Плохо"],
      },
      {
        order: 2,
        required: false,
        type: "text",
        title: "Ваши комментарии",
        description: "Поделитесь любыми мыслями о работе с нами",
      },
      {
        order: 3,
        required: true,
        type: "binary",
        title: "Порекомендуете ли вы нас друзьям?",
      },
    ],
    welcomeScreen: {
      active: true,
      title: "Добро пожаловать!",
      description: "Пожалуйста, пройдите опрос.",
      button_text: "Начать опрос",
      design_settings: { layout: "with_image", alignment: "center" },
    },
    personalScreen: {
      active: true,
      title: "Ваши данные",
      description: "Мы гарантируем конфиденциальность.",
      button_text: "Далее",
      personal_fields: [
        { type: "name", required: true, label: "Имя", placeholder: "Введите имя" },
        { type: "email", required: true, label: "Email", placeholder: "Введите email" },
      ],
      design_settings: { layout: "without_image", alignment: "left" },
    },
    completionScreen: {
      active: true,
      title: "Спасибо!",
      description: "Ваши ответы сохранены.",
      button_text: "Закрыть",
      design_settings: { layout: "without_image", alignment: "center" },
    },
    design_settings: {
      target_id: "survey1",
      placement: "inbuilt",
      width: 80,
      width_unit: "%",
      height: 500,
      height_unit: "px",
      background_color: "#f2f0f0",
      text_color: "#222222",
      button_color: "#97cc9f",
      font_family: "Roboto",
      margin: [20, 20, 20, 20],
      padding: [16, 16, 16, 16],
    },
    display_settings: {
      block_scroll: true,
      prevent_repeat: true,
      timer_sec: 120,
      url_match_mode: "equals",
      url_pattern: ["https://example.com/survey"],
    },
  },
  {
    id: 2,
    questions: [
      {
        order: 1,
        required: true,
        type: "dropdown",
        title: "Ваш возраст",
        options: ["<18", "18–25", "26–35", "36–50", "50+"],
      },
      {
        order: 2,
        required: true,
        type: "textarea",
        title: "Опишите свой опыт",
        description: "Расскажите о вашем впечатлении",
      },
      {
        order: 3,
        required: false,
        type: "date",
        title: "Дата последнего визита",
      },
    ],
    welcomeScreen: {
      active: true,
      button_text: "Старт",
      design_settings: { layout: "image_background", alignment: "center" },
    },
    personalScreen: {
      active: true,
      button_text: "Продолжить",
      design_settings: { layout: "with_image", alignment: "right" },
    },
    completionScreen: {
      active: true,
      button_text: "Готово",
      design_settings: { layout: "without_image", alignment: "left" },
    },
    design_settings: {
      target_id: "survey2",
      placement: "before",
      width: 600,
      width_unit: "px",
      height: 600,
      height_unit: "px",
      background_color: "#ffffff",
      text_color: "#05386b",
      button_color: "#5cdb95",
      font_family: "Montserrat",
      margin: [10, 10, 10, 10],
      padding: [24, 24, 24, 24],
    },
    display_settings: {
      block_scroll: false,
      prevent_repeat: false,
      timer_sec: 0,
      url_match_mode: "contains",
      url_pattern: ["https://example.com"],
    },
  },
];
