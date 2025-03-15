/* eslint-disable sonarjs/pseudo-random */
import { ReactElement } from "react";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

/** Интерфейсы состояний */
export interface ModalState {
  show: boolean;
  content?: ReactElement | string;
  onClose?: () => void;
}

export interface ToasterState {
  show: boolean;
  content?: ReactElement | string;
  onClose?: () => void;
}

export interface LayoutState {
  modal: ModalState;
  toaster: ToasterState;
}

/** Начальное состояние */
const initialState: LayoutState = {
  modal: {
    show: false,
    content: undefined,
    onClose: undefined,
  },
  toaster: {
    show: false,
    content: undefined,
    onClose: undefined,
  },
};

/** Слайл для лейаута */
export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<Omit<ModalState, "show">>) => {
      state.modal = {
        show: true,
        ...action.payload,
      };
    },
    closeModal: state => {
      state.modal = {
        show: false,
        content: undefined,
        onClose: undefined,
      };
    },
    openToaster: (state, action: PayloadAction<Omit<ToasterState, "show">>) => {
      state.toaster = {
        show: true,
        ...action.payload,
      };
    },
    closeToaster: state => {
      state.toaster = {
        show: false,
        content: undefined,
        onClose: undefined,
      };
    },
  },
});

export const { openModal, closeModal, openToaster, closeToaster } = layoutSlice.actions;

export default layoutSlice.reducer;
