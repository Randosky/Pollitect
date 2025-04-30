import type { TDesignSettings } from "../Survey.types";

/** Пропсы вьюшки страницы дизайна */
export type TDesignViewProps = {
  /** Флаг доступности сохранения */
  canSave: boolean;
  /** Настройки дизайна */
  settings: TDesignSettings;
  /** Функция обновления настроек дизайна */
  onChange(upd: Partial<TDesignSettings>): void;
  /** Функция сохранения настроек дизайна */
  handleSave(): void;
  /** Функция отмены сохранения настроек дизайна */
  handleCancel(): void;
};

/** Пропсы компонента с настройками дизайна */
export type TDesignSettingsProps = Pick<
  TDesignViewProps,
  "settings" | "onChange" | "canSave" | "handleCancel" | "handleSave"
>;

/** Пропсы компонента с отображением превью */
export type TDesignPreviewProps = Pick<TDesignViewProps, "settings">;
