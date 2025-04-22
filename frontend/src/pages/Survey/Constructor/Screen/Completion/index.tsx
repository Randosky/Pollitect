// src/pages/Constructor/Screen/Completion.tsx
/* eslint-disable camelcase */
import React, { useEffect, useState } from "react";

import type { TAlignment, TCompletionScreen, TLayout } from "@pages/Survey/Survey.types";

import styles from "./Completion.module.scss";

type Props = {
  data: TCompletionScreen;
  onChange: (upd: Partial<TCompletionScreen>) => void;
};

// simple deep-equality check
function deepEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

const CompletionScreen: React.FC<Props> = ({ data, onChange }) => {
  const [local, setLocal] = useState<TCompletionScreen>(data);

  // sync incoming prop → local only if different
  useEffect(() => {
    if (!deepEqual(data, local)) {
      setLocal(data);
    }
  }, [data]);

  // propagate local → parent only if genuinely changed
  useEffect(() => {
    if (!deepEqual(local, data)) {
      onChange(local);
    }
  }, [local]);

  const update = <K extends keyof TCompletionScreen>(key: K, value: TCompletionScreen[K]) => {
    setLocal({ ...local, [key]: value });
  };

  const updateDesign = <K extends keyof TCompletionScreen["design_settings"]>(
    key: K,
    value: TCompletionScreen["design_settings"][K]
  ) => {
    setLocal({
      ...local,
      design_settings: { ...local.design_settings, [key]: value },
    });
  };

  return (
    <div className={styles.screen}>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={local.active}
          onChange={e => update("active", e.target.checked)}
        />{" "}
        Активировать экран завершения
      </label>

      <div className={styles.field}>
        <label>Заголовок</label>
        <input
          type="text"
          value={local.title || ""}
          onChange={e => update("title", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label>Описание</label>
        <textarea
          value={local.description || ""}
          onChange={e => update("description", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label>Текст кнопки</label>
        <input
          type="text"
          value={local.button_text || ""}
          onChange={e => update("button_text", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label>URL кнопки</label>
        <input
          type="text"
          value={local.button_url || ""}
          onChange={e => update("button_url", e.target.value)}
        />
      </div>

      <div className={styles.design}>
        <h4>Дизайн экрана</h4>

        <div className={styles.field}>
          <label>Схема</label>
          <select
            value={local.design_settings.layout}
            onChange={e => updateDesign("layout", e.target.value as TLayout)}
          >
            <option value="without_image">Без картинки</option>
            <option value="with_image">С картинкой</option>
            <option value="image_background">Картинка фоном</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Выравнивание</label>
          <select
            value={local.design_settings.alignment}
            onChange={e => updateDesign("alignment", e.target.value as TAlignment)}
          >
            <option value="center">По центру</option>
            <option value="left">Слева</option>
            <option value="right">Справа</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>URL картинки</label>
          <input
            type="text"
            value={local.design_settings.image_url || ""}
            onChange={e => updateDesign("image_url", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
