import React from "react";

import type { TSettingsViewProps } from "./Settings.types";

import styles from "./Settings.module.scss";

const FlagsGroup: React.FC<{
  blockScroll: boolean;
  preventRepeat: boolean;
  onChange: (
    field: keyof Pick<TSettingsViewProps["settings"], "block_scroll" | "prevent_repeat">,
    value: boolean
  ) => void;
}> = ({ blockScroll, preventRepeat, onChange }) => (
  <fieldset className={styles.fieldset}>
    <legend className={styles.legend}>Флаги поведения</legend>
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        checked={blockScroll}
        onChange={e => onChange("block_scroll", e.target.checked)}
      />{" "}
      Блокировать прокрутку
    </label>
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        checked={preventRepeat}
        onChange={e => onChange("prevent_repeat", e.target.checked)}
      />{" "}
      Предотвращать повтор
    </label>
  </fieldset>
);

const TimerField: React.FC<{
  timer: number;
  onChange: (value: number) => void;
}> = ({ timer, onChange }) => (
  <fieldset className={styles.fieldset}>
    <legend className={styles.legend}>Таймер показа (сек)</legend>
    <input
      className={styles.input}
      type="number"
      min={0}
      value={timer}
      onChange={e => onChange(+e.target.value)}
    />
  </fieldset>
);

const UrlCondition: React.FC<{
  mode: "contains" | "equals";
  patterns: string[];
  onModeChange: (mode: "contains" | "equals") => void;
  onPatternChange: (pattern: string, index: number) => void;
  addPattern: () => void;
  removePattern: (index: number) => void;
}> = ({ mode, patterns, onModeChange, onPatternChange, addPattern, removePattern }) => (
  <fieldset className={styles.fieldset}>
    <legend className={styles.legend}>Условие показа по URL</legend>
    <div className={styles.radioGroup}>
      <label>
        <input
          type="radio"
          name="urlmode"
          checked={mode === "contains"}
          onChange={() => onModeChange("contains")}
        />{" "}
        Содержит
      </label>
      <label>
        <input
          type="radio"
          name="urlmode"
          checked={mode === "equals"}
          onChange={() => onModeChange("equals")}
        />{" "}
        Строгое совпадение
      </label>
    </div>
    <div className={styles.urlList}>
      {patterns.map((pattern, idx) => (
        <div
          key={idx}
          className={styles.urlItem}
        >
          <input
            className={styles.input}
            type="text"
            placeholder="https://example.com/page"
            value={pattern}
            onChange={e => onPatternChange(e.target.value, idx)}
          />
          {mode === "equals" && (
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removePattern(idx)}
            >
              Удалить
            </button>
          )}
        </div>
      ))}
      {mode === "equals" && (
        <button
          type="button"
          className={styles.addBtn}
          onClick={addPattern}
        >
          Добавить URL
        </button>
      )}
    </div>
  </fieldset>
);

const EmbedCodeBlock: React.FC<{ code: string }> = ({ code }) =>
  code ? (
    <section className={styles.embedSection}>
      <h2 className={styles.legend}>Код для вставки виджета</h2>
      <textarea
        className={styles.textarea}
        readOnly
        rows={3}
        value={code}
      />
    </section>
  ) : null;

const SettingsView: React.FC<TSettingsViewProps> = ({ settings, embedCode, onChange }) => {
  const updateField = <K extends keyof typeof settings>(field: K, value: (typeof settings)[K]) =>
    onChange({ ...settings, [field]: value });

  const handlePatternChange = (pattern: string, idx: number) => {
    const list = [...settings.url_pattern];

    list[idx] = pattern;
    updateField("url_pattern", list);
  };

  const addPattern = () => updateField("url_pattern", [...settings.url_pattern, ""]);
  const removePattern = (i: number) =>
    updateField(
      "url_pattern",
      settings.url_pattern.filter((_, j) => j !== i)
    );

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1>Общие настройки виджета</h1>
      </header>
      <form className={styles.form}>
        <FlagsGroup
          blockScroll={settings.block_scroll}
          preventRepeat={settings.prevent_repeat}
          onChange={(field, val) => updateField(field, val)}
        />
        <TimerField
          timer={settings.timer_sec}
          onChange={val => updateField("timer_sec", val)}
        />
        <UrlCondition
          mode={settings.url_match_mode}
          patterns={settings.url_pattern}
          onModeChange={mode => updateField("url_match_mode", mode)}
          onPatternChange={handlePatternChange}
          addPattern={addPattern}
          removePattern={removePattern}
        />
      </form>
      <EmbedCodeBlock code={embedCode} />
    </section>
  );
};

export default SettingsView;
