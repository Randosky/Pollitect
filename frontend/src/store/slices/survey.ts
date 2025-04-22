/* eslint-disable camelcase */
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

import { INITIAL_SURVEY } from "@pages/Survey/Survey.config";

import type {
  ISurvey,
  TCompletionScreen,
  TDesignSettings,
  TDisplaySettings,
  TPersonalScreen,
  TWelcomeScreen,
} from "@pages/Survey/Survey.types";

export type TSurveyState = {
  surveyForm: ISurvey;
};

/** Начальное состояние */
const initialState: TSurveyState = {
  surveyForm: INITIAL_SURVEY,
};

export const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    /** Общие поля опроса */
    updateSurveyForm: (state, action: PayloadAction<Partial<ISurvey>>) => {
      state.surveyForm = { ...state.surveyForm, ...action.payload };
    },
    /** Настройки экрана приветствия */
    updateWelcomeScreen: (state, action: PayloadAction<Partial<TWelcomeScreen>>) => {
      state.surveyForm.welcomeScreen = {
        ...state.surveyForm.welcomeScreen,
        ...action.payload,
      };
    },
    /** Настройки экрана сбора персональных данных */
    updatePersonalScreen: (state, action: PayloadAction<Partial<TPersonalScreen>>) => {
      state.surveyForm.personalScreen = {
        ...state.surveyForm.personalScreen,
        ...action.payload,
      };
    },
    /** Настройки экрана завершения опроса */
    updateCompletionScreen: (state, action: PayloadAction<Partial<TCompletionScreen>>) => {
      state.surveyForm.completionScreen = {
        ...state.surveyForm.completionScreen,
        ...action.payload,
      };
    },
    /** Настройки дизайна виджета */
    updateDesignSettings: (state, action: PayloadAction<Partial<TDesignSettings>>) => {
      state.surveyForm.design_settings = {
        ...state.surveyForm.design_settings,
        ...action.payload,
      };
    },
    /** Настройки отображения и поведения */
    updateDisplaySettings: (state, action: PayloadAction<Partial<TDisplaySettings>>) => {
      state.surveyForm.display_settings = {
        ...state.surveyForm.display_settings,
        ...action.payload,
      };
    },
  },
});

export const {
  updateSurveyForm,
  updateWelcomeScreen,
  updatePersonalScreen,
  updateCompletionScreen,
  updateDesignSettings,
  updateDisplaySettings,
} = surveySlice.actions;

export default surveySlice.reducer;
