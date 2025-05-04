import React from "react";

import Button from "@ui/Button";
import { TextField } from "@ui/TextField";
import { isDarkColor } from "@utils/isDarkColor";

import type { TDesignPreviewProps } from "../Design.types";

import styles from "./DesignPreview.module.scss";

/** Мини‑превью виджета (заголовок → текст → input → кнопка). */
const DesignPreview: React.FC<TDesignPreviewProps> = ({ settings }) => {
  const wrapperStyle: React.CSSProperties = {
    width: `${settings.width}${settings.width_unit}`,
    height: `${settings.height}${settings.height_unit}`,
    margin: settings.margin.map(v => `${v}px`).join(" "),
    padding: settings.padding.map(v => `${v}px`).join(" "),
    borderRadius: settings.borderRadius.map(v => `${v}px`).join(" "),
    backgroundColor: settings.background_color,
    color: settings.text_color,
    fontFamily: settings.font_family,
  };

  return (
    <section
      className={styles.wrapper}
      style={wrapperStyle}
    >
      <div className={styles.header}>
        <h3 className={styles.heading}>Пример заголовка</h3>

        <p className={styles.description}>
          Небольшое описание, чтобы визуально проверить цвет текста и&nbsp;отступы между элементами.
        </p>
      </div>

      <TextField
        size="mobile"
        isDisabled
        config={{
          inputProps: {
            id: "preview-input",
            className: styles.fieldInp,
            placeholder: "Введите текст...",
          },
          wrapperProps: { className: styles.fieldWrap },
        }}
      />

      <Button
        variant="primary"
        disabled
        className={styles.button}
        style={{
          backgroundColor: settings.button_color,
          color: isDarkColor(settings.button_color) ? "var(--white)" : "var(--black)",
        }}
      >
        Отправить
      </Button>
    </section>
  );
};

export default React.memo(DesignPreview);
