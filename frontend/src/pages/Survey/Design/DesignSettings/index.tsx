/* eslint-disable camelcase */
import React from "react";

import ActionButtons from "@layout/Footer/ActionButtons";

import { FONTS } from "../Design.config";

import type { TDesignSettingsProps } from "../Design.types";
import type { TFontFamily, TPlacement, TUnit } from "@pages/Survey/Survey.types";

import styles from "./DesignSettings.module.scss";

import IndentsEditor from "./IndentsEditor/IndentsEditor";

const DesignSettings: React.FC<TDesignSettingsProps> = ({ canSave, settings, onChange, handleSave, handleCancel }) => {
  return (
    <form className={styles.form}>
      <fieldset className={styles.group}>
        <legend className={styles.legend}>Размещение</legend>
        <select
          className={styles.select}
          value={settings.placement}
          onChange={e => onChange({ placement: e.target.value as TPlacement })}
        >
          <option value="inbuilt">Встроенный</option>
          <option value="before">До элемента</option>
          <option value="after">После элемента</option>
        </select>
      </fieldset>

      <div className={styles.row}>
        <fieldset className={styles.group}>
          <legend className={styles.legend}>Ширина</legend>
          <input
            className={styles.input}
            type="number"
            value={settings.width}
            onChange={e => onChange({ width: +e.target.value })}
          />
          <select
            className={styles.select}
            value={settings.width_unit}
            onChange={e => onChange({ width_unit: e.target.value as TUnit })}
          >
            <option value="%">%</option>
            <option value="px">px</option>
          </select>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>Высота</legend>
          <input
            className={styles.input}
            type="number"
            value={settings.height}
            onChange={e => onChange({ height: +e.target.value })}
          />
          <select
            className={styles.select}
            value={settings.height_unit}
            onChange={e => onChange({ height_unit: e.target.value as TUnit })}
          >
            <option value="px">px</option>
            <option value="%">%</option>
          </select>
        </fieldset>
      </div>

      <div className={styles.row}>
        <fieldset className={styles.group}>
          <legend className={styles.legend}>Цвет фона</legend>
          <input
            className={styles.input}
            type="color"
            value={settings.background_color}
            onChange={e => onChange({ background_color: e.target.value })}
          />
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>Цвет текста</legend>
          <input
            className={styles.input}
            type="color"
            value={settings.text_color}
            onChange={e => onChange({ text_color: e.target.value })}
          />
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>Цвет кнопки</legend>
          <input
            className={styles.input}
            type="color"
            value={settings.button_color}
            onChange={e => onChange({ button_color: e.target.value })}
          />
        </fieldset>
      </div>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>Шрифт</legend>
        <select
          className={styles.select}
          value={settings.font_family}
          onChange={e => onChange({ font_family: e.target.value as TFontFamily })}
        >
          {FONTS.map(f => (
            <option
              key={f}
              value={f}
            >
              {f}
            </option>
          ))}
        </select>
      </fieldset>

      <IndentsEditor
        label="Padding"
        value={settings.padding}
        onChange={val => onChange({ padding: val })}
      />

      <IndentsEditor
        label="Margin"
        value={settings.margin}
        onChange={val => onChange({ margin: val })}
      />

      {canSave && (
        <ActionButtons
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      )}
    </form>
  );
};

export default DesignSettings;
