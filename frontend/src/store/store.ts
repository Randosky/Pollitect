import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

import layout from "./slices/layout";
import user from "./slices/user";
import survey from "./slices/survey";

/** Стор с сохраненными редюсерами */
export const store = configureStore({
  reducer: {
    user,
    layout,
    survey
  },
});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;
