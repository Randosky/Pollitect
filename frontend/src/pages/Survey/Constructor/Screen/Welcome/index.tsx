/* eslint-disable camelcase */
/* src/pages/Constructor/Screen/Welcome.tsx */
import React, { useEffect, useState } from "react";

import type { TAlignment, TLayout, TWelcomeScreen } from "@pages/Survey/Survey.types";

import styles from "./Welcome.module.scss";

type Props = {
  data: TWelcomeScreen;
  onChange: (upd: Partial<TWelcomeScreen>) => void;
};

const WelcomeScreen: React.FC<Props> = ({ data, onChange }) => {
  const [local, setLocal] = useState<TWelcomeScreen>(data);

  // whenever the parent prop changes, update our local state
  useEffect(() => {
    setLocal(data);
  }, [data]);

  // only push local → parent when local actually differs from data
  useEffect(() => {
    if (JSON.stringify(local) !== JSON.stringify(data)) {
      onChange(local);
    }
  }, [local, data, onChange]);

  const update = <K extends keyof TWelcomeScreen>(key: K, value: TWelcomeScreen[K]) =>
    setLocal(prev => ({ ...prev, [key]: value }));

  const updateDesign = <K extends keyof TWelcomeScreen["design_settings"]>(
    key: K,
    value: TWelcomeScreen["design_settings"][K]
  ) =>
    setLocal(prev => ({
      ...prev,
      design_settings: { ...prev.design_settings, [key]: value },
    }));

  return (
    <div className={styles.screen}>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={local.active}
          onChange={e => update("active", e.target.checked)}
        />{" "}
        Активировать экран
      </label>

      <div className={styles.field}>
        <label>Подсказка</label>
        <input
          type="text"
          value={local.hint || ""}
          onChange={e => update("hint", e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label>Заголовок</label>
        <input
          type="text"
          value={local.title || ""}
          onChange={e => update("title", e.target.value)}
          required
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
          value={local.button_text}
          onChange={e => update("button_text", e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label>Юридическая информация</label>
        <textarea
          value={local.legal_info || ""}
          onChange={e => update("legal_info", e.target.value)}
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

export default WelcomeScreen;
