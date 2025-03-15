import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

import layout from "./slices/layout";

export function makeStore() {
  return configureStore({
    reducer: {
      layout,
    },
  });
}

export const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;
