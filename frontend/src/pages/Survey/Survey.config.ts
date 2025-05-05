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
    active: true,
    button_text: "Начать",
    design_settings: { layout: "without_image", alignment: "left" },
  },
  personalScreen: {
    active: true,
    button_text: "Отправить",
    design_settings: { layout: "without_image", alignment: "left" },
  },
  completionScreen: {
    active: true,
    button_text: "Завершить",
    design_settings: { layout: "without_image", alignment: "left" },
  },
  design_settings: {
    placement: "inbuilt",
    width: 100,
    width_unit: "%",
    height: 400,
    height_unit: "px",
    background_color: "#fefefe",
    text_color: "#222222",
    button_color: "#97cc9f",
    font_family: "Open Sans",
    borderRadius: [5, 5, 5, 5],
    margin: [0, 0, 0, 0],
    padding: [16, 16, 16, 16],
  },
  display_settings: {
    target_id: "",
    block_scroll: false,
    prevent_repeat: false,
    timer_sec: -1,
    url_match_mode: "contains",
    url_pattern: [window.location.origin],
  },
  title: "Новый опрос",
  active: false,
  responses: [],
  statistics: {
    responsesCount: 0,
    completionRate: 0,
    averageTimeSec: undefined,
  },
};
