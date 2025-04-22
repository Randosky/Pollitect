/* eslint-disable camelcase */
// src/pages/Constructor/Screen/Personal.tsx
import React, { useEffect, useState } from "react";

import type {
  TAlignment,
  TLayout,
  TPersonalFieldType,
  TPersonalScreen,
  TScreenPersonalField,
} from "@pages/Survey/Survey.types";

import styles from "./Personal.module.scss";

type Props = {
  data: TPersonalScreen;
  onChange: (upd: Partial<TPersonalScreen>) => void;
};

const ALL_FIELDS: TPersonalFieldType[] = ["name", "email", "phone", "address"];

// Simple deep compare
function deepEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

const PersonalScreen: React.FC<Props> = ({ data, onChange }) => {
  const [local, setLocal] = useState<TPersonalScreen>(data);

  // Mirror prop → local, only when really changed
  useEffect(() => {
    if (!deepEqual(data, local)) {
      setLocal(data);
    }
  }, [data]);

  // Propagate local → parent only when it truly differs from data
  useEffect(() => {
    if (!deepEqual(local, data)) {
      onChange(local);
    }
  }, [local]);

  const update = <K extends keyof TPersonalScreen>(key: K, value: TPersonalScreen[K]) => {
    setLocal({ ...local, [key]: value });
  };

  const updateDesign = <K extends keyof TPersonalScreen["design_settings"]>(
    key: K,
    value: TPersonalScreen["design_settings"][K]
  ) => {
    setLocal({
      ...local,
      design_settings: { ...local.design_settings, [key]: value },
    });
  };

  const toggleField = (type: TPersonalFieldType) => {
    let fields = local.personal_fields || [];

    if (fields.some(f => f.type === type)) {
      fields = fields.filter(f => f.type !== type);
    } else {
      fields = [...fields, { type, required: false, label: type, placeholder: "" } as TScreenPersonalField];
    }
    setLocal({ ...local, personal_fields: fields });
  };

  const updatePersonalField = (idx: number, upd: Partial<TScreenPersonalField>) => {
    const fields = [...(local.personal_fields || [])];

    fields[idx] = { ...fields[idx], ...upd };
    setLocal({ ...local, personal_fields: fields });
  };

  return (
    <div className={styles.screen}>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={local.active}
          onChange={e => update("active", e.target.checked)}
        />{" "}
        Активировать сбор персональных данных
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
          value={local.button_text}
          onChange={e => update("button_text", e.target.value)}
        />
      </div>

      <fieldset className={styles.checkboxGroup}>
        <legend>Поля для сбора</legend>
        {ALL_FIELDS.map(type => (
          <label
            key={type}
            className={styles.checkbox}
          >
            <input
              type="checkbox"
              checked={local.personal_fields?.some(f => f.type === type) || false}
              onChange={() => toggleField(type)}
            />{" "}
            {type}
          </label>
        ))}
      </fieldset>

      {local.personal_fields?.map((field, idx) => (
        <div
          key={idx}
          className={styles.field}
        >
          <h5>{field.type}</h5>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={field.required}
              onChange={e => updatePersonalField(idx, { required: e.target.checked })}
            />{" "}
            Обязательное
          </label>
          <label>Метка</label>
          <input
            type="text"
            value={field.label}
            onChange={e => updatePersonalField(idx, { label: e.target.value })}
          />
          <label>Placeholder</label>
          <input
            type="text"
            value={field.placeholder}
            onChange={e => updatePersonalField(idx, { placeholder: e.target.value })}
          />
        </div>
      ))}

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

export default PersonalScreen;
