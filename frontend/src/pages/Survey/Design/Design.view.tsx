import React from "react";

import type { TDesignViewProps } from "./Design.types";

import styles from "./Design.module.scss";

const FONT_FAMILIES = ["Open Sans", "Arial", "Times New Roman", "Roboto", "Montserrat"];

const DesignView: React.FC<TDesignViewProps> = ({ settings, onChange, onSave }) => {
  return (
    <div className={styles.design}>
      <div className={styles.group}>
        <label>Размещение виджета</label>
        <select
          value={settings.widgetPlacement}
          onChange={e => onChange({ ...settings, widgetPlacement: e.target.value as any })}
        >
          <option value="embedded">Встроенный</option>
          <option value="left">Слева</option>
          <option value="right">Справа</option>
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
            value={settings.widthUnit}
            onChange={e => onChange({ ...settings, widthUnit: e.target.value as any })}
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
            value={settings.heightUnit}
            onChange={e => onChange({ ...settings, heightUnit: e.target.value as any })}
          >
            <option value="px">px</option>
            <option value="%">%</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label>Фон виджета</label>
          <input
            type="color"
            value={settings.bgColor}
            onChange={e => onChange({ ...settings, bgColor: e.target.value })}
          />
        </div>
        <div className={styles.group}>
          <label>Цвет текста</label>
          <input
            type="color"
            value={settings.textColor}
            onChange={e => onChange({ ...settings, textColor: e.target.value })}
          />
        </div>
        <div className={styles.group}>
          <label>Цвет кнопок</label>
          <input
            type="color"
            value={settings.buttonColor}
            onChange={e => onChange({ ...settings, buttonColor: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label>Шрифт</label>
          <select
            value={settings.fontFamily}
            onChange={e => onChange({ ...settings, fontFamily: e.target.value })}
          >
            {FONT_FAMILIES.map(f => (
              <option
                key={f}
                value={f}
              >
                {f}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.group}>
          <label>Отступ (px)</label>
          <input
            type="number"
            value={settings.padding}
            onChange={e => onChange({ ...settings, padding: +e.target.value })}
          />
        </div>
        <div className={styles.group}>
          <label>Внешний отступ (px)</label>
          <input
            type="number"
            value={settings.margin}
            onChange={e => onChange({ ...settings, margin: +e.target.value })}
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
};

export default DesignView;
