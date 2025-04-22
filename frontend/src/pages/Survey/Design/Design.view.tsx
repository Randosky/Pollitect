/* eslint-disable camelcase */
import React from "react";

import type { TFontFamily, TPlacement } from "../Survey.types";
import type { TDesignViewProps } from "./Design.types";

import styles from "./Design.module.scss";

const FONTS = ["Open Sans", "Arial", "Times New Roman", "Roboto", "Montserrat"];

const DesignView: React.FC<TDesignViewProps> = ({ settings, onChange, onSave }) => (
  <div className={styles.design}>
    <div className={styles.group}>
      <label>Размещение виджета</label>
      <select
        value={settings.placement}
        onChange={e => onChange({ ...settings, placement: e.target.value as TPlacement })}
      >
        <option value="inbuilt">Встроенный</option>
        <option value="before">До элемента</option>
        <option value="after">После элемента</option>
      </select>
    </div>

    <div className={styles.row}>
      <div className={styles.group}>
        <label>Ширина</label>
        <input
          type="number"
          value={settings.width}
          onChange={e => onChange({ ...settings, width: +e.target.value })}
        />
        <select
          value={settings.width_unit}
          onChange={e => onChange({ ...settings, width_unit: e.target.value as any })}
        >
          <option value="%">%</option>
          <option value="px">px</option>
        </select>
      </div>
      <div className={styles.group}>
        <label>Высота</label>
        <input
          type="number"
          value={settings.height}
          onChange={e => onChange({ ...settings, height: +e.target.value })}
        />
        <select
          value={settings.height_unit}
          onChange={e => onChange({ ...settings, height_unit: e.target.value as any })}
        >
          <option value="px">px</option>
          <option value="%">%</option>
        </select>
      </div>
    </div>

    <div className={styles.row}>
      <div className={styles.group}>
        <label>Цвет фона</label>
        <input
          type="color"
          value={settings.background_color}
          onChange={e => onChange({ ...settings, background_color: e.target.value })}
        />
      </div>
      <div className={styles.group}>
        <label>Цвет текста</label>
        <input
          type="color"
          value={settings.text_color}
          onChange={e => onChange({ ...settings, text_color: e.target.value })}
        />
      </div>
      <div className={styles.group}>
        <label>Цвет кнопок</label>
        <input
          type="color"
          value={settings.button_color}
          onChange={e => onChange({ ...settings, button_color: e.target.value })}
        />
      </div>
    </div>

    <div className={styles.group}>
      <label>Шрифт</label>
      <select
        value={settings.font_family}
        onChange={e => onChange({ ...settings, font_family: e.target.value as TFontFamily })}
      >
        {FONTS.map(f => (
          <option key={f}>{f}</option>
        ))}
      </select>
    </div>

    <div className={styles.row}>
      <div className={styles.group}>
        <label>Отступ (px)</label>
        <input
          type="number"
          value={settings.padding[0]}
          onChange={e =>
            onChange({ ...settings, padding: [+e.target.value, +e.target.value, +e.target.value, +e.target.value] })
          }
        />
      </div>
      <div className={styles.group}>
        <label>Внешний отступ (px)</label>
        <input
          type="number"
          value={settings.margin[0]}
          onChange={e =>
            onChange({ ...settings, margin: [+e.target.value, +e.target.value, +e.target.value, +e.target.value] })
          }
        />
      </div>
    </div>

    <button
      className={styles.saveBtn}
      onClick={onSave}
    >
      Сохранить дизайн
    </button>
  </div>
);

export default DesignView;
