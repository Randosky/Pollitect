import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "user";

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

/** Возвращает initial state: из sessionStorage или дефолт */
const getInitialState = (): IUser => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);

    if (stored) {
      return JSON.parse(stored) as IUser;
    }
  } catch (error) {
    console.error(error);
  }

  return {
    id: -1,
    email: "",
    role: "user",
  };
};

/** Слайс пользователя */
export const userSlice = createSlice({
  name: "user",
  initialState: getInitialState(),
  reducers: {
    /**
     * Обновляет часть состояния пользователя и сохраняет в sessionStorage
     */
    updateUserState(state, action: PayloadAction<Partial<IUser>>) {
      const next = { ...state, ...action.payload };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    },
    /**
     * Очищает состояние пользователя (логаут) и удаляет из sessionStorage
     */
    clearUserState() {
      const next: IUser = { id: -1, email: "", role: "user" };

      sessionStorage.removeItem(STORAGE_KEY);

      return next;
    },
  },
});

export const { updateUserState, clearUserState } = userSlice.actions;
export default userSlice.reducer;
