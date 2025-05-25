/* eslint-disable camelcase */
import React from "react";

import Select from "@ui/Select";

import { FONTS } from "../Design.config";

import type { TDesignSettingsProps } from "../Design.types";
import type { TFontFamily, TPlacement } from "@pages/Survey/Survey.types";

import styles from "./DesignSettings.module.scss";

import ColorPickerField from "./ColorPickerField";
import IndentsEditor from "./IndentsEditor/IndentsEditor";
import NumberFieldWithUnit from "./NumberFieldWithUnit";

const DesignSettings: React.FC<TDesignSettingsProps> = ({
  settings,
  siteBg,
  siteElementBg,
  onChange,
  setSiteBg,
  setSiteElementBg,
}) => {
  return (
    <form className={styles.form}>
      {/* ───── размещение ───── */}
      <section className={styles.block}>
        <span className={styles.label}>Размещение виджета</span>

        <Select
          size="mobile"
          value={settings.placement}
          onChange={e => onChange({ placement: e.target.value as TPlacement })}
        >
          <option value="inbuilt">Встроенный</option>
          <option value="before">До элемента</option>
          <option value="after">После элемента</option>
        </Select>
      </section>

      {/* ───── шрифт ───── */}
      <section className={styles.block}>
        <span className={styles.label}>Шрифт виджета</span>
        <Select
          size="mobile"
          value={settings.font_family}
          onChange={e => onChange({ font_family: e.target.value as TFontFamily })}
        >
          {FONTS.map(f => (
            <option key={f}>{f}</option>
          ))}
        </Select>
      </section>

      {/* ───── размеры ───── */}
      <section className={styles.row}>
        {/* ширина */}
        <div className={styles.block}>
          <span className={styles.label}>Ширина</span>

          <NumberFieldWithUnit
            value={settings.width}
            unit={settings.width_unit}
            onChange={(v, u) => onChange({ width: v, width_unit: u })}
            size="mobile"
          />
        </div>

        {/* высота */}
        <div className={`${styles.block} ${styles.sizeItem}`}>
          <span className={styles.label}>Высота</span>

          <NumberFieldWithUnit
            value={settings.height}
            unit={settings.height_unit}
            onChange={(v, u) => onChange({ height: v, height_unit: u })}
            size="mobile"
          />
        </div>
      </section>

      {/* ───── цвета ───── */}
      <section className={`${styles.block} ${styles.colors}`}>
        <ColorPickerField
          label="Фон сайта"
          id="site-bg"
          value={siteBg}
          onChange={setSiteBg}
        />

        {settings.placement !== "inbuilt" && (
          <ColorPickerField
            label="Фон элемента на сайте"
            id="site-element-bg"
            value={siteElementBg}
            onChange={setSiteElementBg}
          />
        )}

        <ColorPickerField
          label="Фон виджета"
          id="widget-bg"
          value={settings.background_color}
          onChange={v => onChange({ background_color: v })}
        />

        <ColorPickerField
          label="Цвет текста"
          id="widget-text"
          value={settings.text_color}
          onChange={v => onChange({ text_color: v })}
        />

        <ColorPickerField
          label="Цвет кнопок"
          id="widget-button"
          value={settings.button_color}
          onChange={v => onChange({ button_color: v })}
        />
      </section>

      {/* ───── скругление ───── */}
      <IndentsEditor
        isBorder
        label="Скругление краев"
        value={settings.borderRadius}
        onChange={val => onChange({ borderRadius: val })}
      />

      {/* ───── отступы ───── */}
      <IndentsEditor
        label="Внешние отступы (Margin)"
        value={settings.margin}
        onChange={val => onChange({ margin: val })}
      />

      <IndentsEditor
        label="Внутренние отступы (Padding)"
        value={settings.padding}
        onChange={val => onChange({ padding: val })}
      />
    </form>
  );
};

export default React.memo(DesignSettings);
