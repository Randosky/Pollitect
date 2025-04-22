import React from "react";

import type { TSettingsViewProps } from "./Settings.types";

import styles from "./Settings.module.scss";

const SettingsView: React.FC<TSettingsViewProps> = ({ settings, onChange, onSave, embedCode }) => (
  <div className={styles.settings}>
    <div className={styles.group}>
      <label>ID контейнера</label>
      <input
        value={settings.htmlTargetId}
        onChange={e => onChange({ ...settings, htmlTargetId: e.target.value })}
      />
    </div>

    <label className={styles.checkbox}>
      <input
        type="checkbox"
        checked={settings.blockScroll}
        onChange={e => onChange({ ...settings, blockScroll: e.target.checked })}
      />{" "}
      Блокировать прокрутку
    </label>

    <label className={styles.checkbox}>
      <input
        type="checkbox"
        checked={settings.preventRepeat}
        onChange={e => onChange({ ...settings, preventRepeat: e.target.checked })}
      />{" "}
      Предотвращать повтор
    </label>

    <div className={styles.group}>
      <label>Таймер (сек)</label>
      <input
        type="number"
        min={0}
        value={settings.timerSec}
        onChange={e => onChange({ ...settings, timerSec: +e.target.value })}
      />
    </div>

    <div className={styles.group}>
      <label>Условие показа</label>
      <div className={styles.row}>
        <label>
          <input
            type="radio"
            name="urlmode"
            value="contains"
            checked={settings.urlMatchMode === "contains"}
            onChange={() => onChange({ ...settings, urlMatchMode: "contains" })}
          />{" "}
          содержит URL
        </label>
        <label>
          <input
            type="radio"
            name="urlmode"
            value="equals"
            checked={settings.urlMatchMode === "equals"}
            onChange={() => onChange({ ...settings, urlMatchMode: "equals" })}
          />{" "}
          точное совпадение
        </label>
      </div>
      <input
        value={settings.urlPattern}
        onChange={e => onChange({ ...settings, urlPattern: e.target.value })}
      />
    </div>

    <button
      className={styles.saveBtn}
      onClick={onSave}
    >
      Сохранить настройки
    </button>

    {embedCode && (
      <div className={styles.embed}>
        <label>Код для вставки виджета</label>
        <textarea
          readOnly
          rows={3}
          value={embedCode}
        />
      </div>
    )}
  </div>
);

export default SettingsView;
