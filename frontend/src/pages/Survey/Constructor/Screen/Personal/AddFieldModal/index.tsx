// AddFieldModal.tsx
import React, { useEffect, useState } from "react";

import Button from "@ui/Button";
import Checkbox from "@ui/Checkbox";
import Select from "@ui/Select";
import { TextField } from "@ui/TextField";

import { PERSONAL_SCREEN_FIELDS, PERSONAL_SCREEN_FIELDS_MAP } from "@pages/Survey/Constructor/Constuctor.config";

import { TPersonalFieldType, TScreenPersonalField } from "@pages/Survey/Survey.types";

import styles from "./AddFieldModal.module.scss";

interface AddFieldModalProps {
  /** Существующие типы (чтобы не дать выбрать дубликат) */
  existingTypes: TPersonalFieldType[];
  /** Если редактируем – передаём начальные данные и индекс */
  initial?: TScreenPersonalField;
  index?: number;
  onSave: (field: TScreenPersonalField, index?: number) => void;
  onCancel: () => void;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({ existingTypes, initial, index, onSave, onCancel }) => {
  const [type, setType] = useState<TPersonalFieldType>(initial?.type ?? PERSONAL_SCREEN_FIELDS[0]);
  const [label, setLabel] = useState(initial?.label ?? "");
  const [placeholder, setPlaceholder] = useState(initial?.placeholder ?? "");
  const [required, setRequired] = useState(initial?.required ?? false);

  // Только те, которые ещё не выбраны (или текущий при редактировании)
  const options = PERSONAL_SCREEN_FIELDS.filter(t => t === initial?.type || !existingTypes.includes(t));

  // Если current type вдруг стал недоступен — переключаем
  useEffect(() => {
    if (!options.includes(type)) setType(options[0]);
  }, [options]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ type, label, placeholder, required }, index);
  };

  return (
    <form
      className={styles.modal}
      onSubmit={handleSubmit}
    >
      <h3 className={styles.title}>
        {initial?.type ? `Редактировать ${PERSONAL_SCREEN_FIELDS_MAP[initial.type]}` : "Новое поле"}
      </h3>

      <label className={styles.field}>
        <span className={styles.labell}>Тип поля</span>

        <Select
          size="mobile"
          value={type}
          onChange={e => setType(e.target.value as TPersonalFieldType)}
        >
          {options.map((opt: TPersonalFieldType) => (
            <option
              key={opt}
              value={opt}
            >
              {PERSONAL_SCREEN_FIELDS_MAP[opt]}
            </option>
          ))}
        </Select>
      </label>

      <TextField
        size="mobile"
        config={{
          labelProps: { value: "Название поля" },
          inputProps: {
            value: label,
            placeholder: type ? `Например, "${PERSONAL_SCREEN_FIELDS_MAP[type]}"` : "",
            onChange: e => setLabel(e.target.value),
            required: true,
          },
        }}
      />

      <TextField
        size="mobile"
        config={{
          labelProps: { value: "Подсказка внутри поля" },
          inputProps: {
            value: placeholder,
            placeholder: type ? `Например, "Введите ${PERSONAL_SCREEN_FIELDS_MAP[type]}"` : "",
            onChange: e => setPlaceholder(e.target.value),
          },
        }}
      />

      <Checkbox
        size="mobile"
        label="Обязательное"
        inputProps={{
          checked: required,
          id: `add-field-modal-required-${index}`,
          onChange: e => setRequired(e.target.checked),
        }}
      />

      <div className={styles.buttons}>
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Отмена
        </Button>

        <Button
          type="submit"
          disabled={!label.trim()}
        >
          Сохранить
        </Button>
      </div>
    </form>
  );
};

export default React.memo(AddFieldModal);
