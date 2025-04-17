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

/** Начальное состояние */
const initialState: TUserState = {
  id: -1,
  email: "",
  role: "user",
};

/** Слайл для лейаута */
export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    updateUserState(state, action: PayloadAction<Partial<TUserState>>) {
      return { ...state, ...action.payload };
    },
    clearUserState() {
      return {
        id: -1,
        email: "",
        role: "user",
      };
    },
  },
});

export const { updateUserState, clearUserState } = layoutSlice.actions;

export default layoutSlice.reducer;
