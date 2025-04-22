import React from "react";

import type { QuestionItem, QuestionType } from "./Constructor.types";

import styles from "./Constructor.module.scss";

import Binary from "./Question/Binary";
import Date from "./Question/Date";
import Dropdown from "./Question/Dropdown";
import Multi from "./Question/Multi";
import Single from "./Question/Single";
import Text from "./Question/Text";
import Textarea from "./Question/Textarea";
import Completion from "./Screen/Completion";
import Personal from "./Screen/Personal";
import Welcome from "./Screen/Welcome";

const mapComp: Record<string, React.FC<{ item: QuestionItem; onChange: (f: Partial<QuestionItem>) => void }>> = {
  single: Single,
  multi: Multi,
  binary: Binary,
  dropdown: Dropdown,
  text: Text,
  textarea: Textarea,
  date: Date,
  welcome: Welcome,
  personal: Personal,
  completion: Completion,
};

type Props = {
  items: QuestionItem[];
  setItems: React.Dispatch<React.SetStateAction<QuestionItem[]>>;
  onSave: () => void;
};

const ConstructorView: React.FC<Props> = ({ items, setItems, onSave }) => {
  const addItem = (type: QuestionItem["type"]) => {
    setItems([
      ...items,
      {
        type,
        title: "",
        description: "",
        options: type === "single" || type === "multi" || type === "dropdown" ? [""] : undefined,
      },
    ]);
  };
  const updateItem = (idx: number, field: Partial<QuestionItem>) => {
    const arr = [...items];

    arr[idx] = { ...arr[idx], ...field };
    setItems(arr);
  };
  const removeItem = (idx: number) => {
    const arr = [...items];

    arr.splice(idx, 1);
    setItems(arr);
  };

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        {["welcome", "personal", "single", "multi", "binary", "dropdown", "text", "textarea", "date", "completion"].map(
          t => (
            <button
              key={t}
              onClick={() => addItem(t as QuestionType)}
            >
              {t}
            </button>
          )
        )}
        <button
          onClick={onSave}
          className={styles.save}
        >
          Сохранить
        </button>
      </div>
      {items.map((it, idx) => {
        const Comp = mapComp[it.type];

        return (
          <div
            key={idx}
            className={styles.item}
          >
            <button
              className={styles.remove}
              onClick={() => removeItem(idx)}
            >
              ×
            </button>
            <Comp
              item={it}
              onChange={(f: Partial<QuestionItem>) => updateItem(idx, f)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ConstructorView;
