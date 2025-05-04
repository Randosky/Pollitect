import type { TDesignSettings } from "../Survey.types";

/** Пропсы вьюшки страницы дизайна */
export type TDesignViewProps = {
  /** Настройки дизайна */
  settings: TDesignSettings;
  /** Фон страницы */
  siteBg: string;
  /** Фон элемента на странице */
  siteElementBg: string;
  /** Функция обновления настроек дизайна */
  onChange(upd: Partial<TDesignSettings>): void;
  /** Функция обновления фона страницы */
  setSiteBg: (v: string) => void;
  /** Функция обновления фона элемента на странице */
  setSiteElementBg: (v: string) => void;
};

/** Пропсы компонента с настройками дизайна */
export type TDesignSettingsProps = Pick<
  TDesignViewProps,
  "settings" | "onChange" | "siteBg" | "siteElementBg" | "setSiteBg" | "setSiteElementBg"
>;

/** Пропсы компонента с отображением превью */
export type TDesignPreviewProps = Pick<TDesignViewProps, "settings">;

/** Пропсы компонента с отображением элемента пользовате */
export type TDesignUserElementProps = Pick<TDesignViewProps, "siteElementBg">;
