import { createSlice } from "@reduxjs/toolkit";

/** Интерфейсы карточки опроса */
export interface SurveyCard {
  id: number;
  title: string;
  description: string;
  responsesCount: number;
  completionRate: number;
  updatedAt: string;
}

export type TSurveyState = object;

/** Начальное состояние */
const initialState: TSurveyState = {};

/** Слайл для лейаута */
export const surveySlice = createSlice({
  name: "surveySlice",
  initialState,
  reducers: {},
});

export const {} = surveySlice.actions;

export default surveySlice.reducer;
