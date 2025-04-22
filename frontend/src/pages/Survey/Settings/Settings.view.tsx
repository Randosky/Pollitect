/* eslint-disable camelcase */
import React from "react";

import type { TSettingsViewProps } from "./Settings.types";

import styles from "./Settings.module.scss";

const SettingsView: React.FC<TSettingsViewProps> = ({ settings, embedCode, onChange, onSave }) => (
  <div className={styles.settings}>
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        checked={settings.block_scroll}
        onChange={e => onChange({ ...settings, block_scroll: e.target.checked })}
      />
      Блокировать прокрутку
    </label>

    <label className={styles.checkbox}>
      <input
        type="checkbox"
        checked={settings.prevent_repeat}
        onChange={e => onChange({ ...settings, prevent_repeat: e.target.checked })}
      />
      Предотвращать повтор
    </label>

    <div className={styles.group}>
      <label>Таймер (сек)</label>
      <input
        type="number"
        min={0}
        value={settings.timer_sec}
        onChange={e => onChange({ ...settings, timer_sec: +e.target.value })}
      />
    </div>

    <div className={styles.group}>
      <label>Условие показа</label>
      <div className={styles.row}>
        <label>
          <input
            type="radio"
            name="urlmode"
            checked={settings.url_match_mode === "contains"}
            onChange={() => onChange({ ...settings, url_match_mode: "contains" })}
          />
          содержит URL
        </label>
        <label>
          <input
            type="radio"
            name="urlmode"
            checked={settings.url_match_mode === "equals"}
            onChange={() => onChange({ ...settings, url_match_mode: "equals" })}
          />
          точное совпадение
        </label>
      </div>
      <input
        type="text"
        value={settings.url_pattern}
        onChange={e => onChange({ ...settings, url_pattern: [e.target.value] })}
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
