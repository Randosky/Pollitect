import React from "react";

import type { TDesignPreviewProps } from "../Design.types";

import styles from "./DesignPreview.module.scss";

const DesignPreview: React.FC<TDesignPreviewProps> = ({ settings }) => {
  const style: React.CSSProperties = {
    width: `${settings.width}${settings.width_unit}`,
    height: `${settings.height}${settings.height_unit}`,
    margin: settings.margin.map(m => `${m}px`).join(" "),
    padding: settings.padding.map(p => `${p}px`).join(" "),
    backgroundColor: settings.background_color,
    color: settings.text_color,
    fontFamily: settings.font_family,
  };

  return (
    <section
      className={styles.wrapper}
      style={style}
    >
      <h3 className={styles.heading}>Пример заголовка</h3>
      <p className={styles.paragraph}>Текст для предпросмотра дизайна.</p>
      <input
        className={styles.input}
        placeholder="Введите что-нибудь..."
        disabled
      />
      <button
        className={styles.button}
        style={{ backgroundColor: settings.button_color }}
      >
        Отправить
      </button>
    </section>
  );
};

export default DesignPreview;
