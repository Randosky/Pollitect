import { ReactElement } from "react";

/** Пропсы основного компонента TextField */
export type TTextFieldProps = {
  /** Размер поля ввода */
  size?: TTextFieldSize;
  /** Указывает на наличие ошибки в поле ввода */
  isError?: boolean;
  /** Выключено ли поле */
  isDisabled?: boolean;
  /** Компонент иконки */
  icon?: ReactElement;
  /** Тип поля ввода */
  type?: TTextFieldType;

  /** Конфигурация для подкомпонентов TextField */
  config?: {
    /** Пропсы для компонента ввода input */
    inputProps?: TTextFieldInputProps;
    /** Пропсы для лейбла поля ввода */
    labelProps?: TTextFieldLabelProps;
    /** Пропсы для обертки поля ввода */
    wrapperProps?: TTextFieldWrapperProps;
    /** Пропсы для контейнера поля ввода */
    containerProps?: TTextFieldContainerProps;
    /** Пропсы для компонента ввода textarea */
    textAreaProps?: TTextFieldTextAreaProps;
  };

  /** Кастомный компонент ввода, если необходимо */
  customInputComponent?: React.ReactNode;
};

/** Пропсы для контейнера TextField */
export type TTextFieldContainerProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/** Пропсы для лейбла TextField */
export type TTextFieldLabelProps = {
  /** Текст метки поля ввода */
  value: string;
} & React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;

/** Пропсы для обертки TextField */
export type TTextFieldWrapperProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/** Пропсы для ввода input в TextField */
export type TTextFieldInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

/** Пропсы для ввода textarea в TextField */
export type TTextFieldTextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

/** Размеры для поля ввода */
export type TTextFieldSize = "mobile" | "desktop";

/** Тип для поля ввода */
export type TTextFieldType = "input" | "textarea";
