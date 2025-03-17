import { PayloadAction, createSlice } from "@reduxjs/toolkit";

/** Интерфейсы состояний */
export interface IUser {
  id: number;
  email: string;
  role: "user" | "admin";
  name?: string;
  phone?: string;
}

export type TAccessToken = {
  accessToken: string;
};

export type TUserWithAccessToken = {
  user: IUser;
} & TAccessToken;

export type TUserState = IUser;

/**
 * Возвращает начальное состояние пользователя
 *
 * Если в sessionStorage есть состояние, то возвращает его,
 * иначе возвращает состояние по умолчанию
 *
 * @returns {TUserState} - начальное состояние пользователя
 */
const getInitialState = (): TUserState => {
  const storedState = sessionStorage.getItem("userState");

  if (storedState) {
    return JSON.parse(storedState);
  }

  return {
    id: -1,
    email: "",
    role: "user",
  };
};

/** Начальное состояние */
const initialState: TUserState = getInitialState();

/** Слайл для лейаута */
export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    updateUserState(state, action: PayloadAction<Partial<TUserState>>) {
      const updatedState: TUserState = { ...state, ...action.payload };

      sessionStorage.setItem("userState", JSON.stringify(updatedState));

      return updatedState;
    },
    clearUserState() {
      const updatedState: TUserState = {
        id: -1,
        email: "",
        role: "user",
      };

      sessionStorage.setItem("userState", JSON.stringify(updatedState));

      return updatedState;
    },
  },
});

export const { updateUserState, clearUserState } = layoutSlice.actions;

export default layoutSlice.reducer;
