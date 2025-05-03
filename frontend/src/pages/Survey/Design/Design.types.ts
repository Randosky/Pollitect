import type { TDesignSettings } from "../Survey.types";

/** Пропсы вьюшки страницы дизайна */
export type TDesignViewProps = {
  /** Настройки дизайна */
  settings: TDesignSettings;
  /** Функция обновления настроек дизайна */
  onChange(upd: Partial<TDesignSettings>): void;
};

/** Пропсы компонента с настройками дизайна */
export type TDesignSettingsProps = Pick<TDesignViewProps, "settings" | "onChange">;

/** Пропсы компонента с отображением превью */
export type TDesignPreviewProps = Pick<TDesignViewProps, "settings">;
