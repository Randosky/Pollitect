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
