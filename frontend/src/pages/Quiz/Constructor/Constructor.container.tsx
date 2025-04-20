import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import ConstructorView from "./Constructor.view";

import type { QuestionItem } from "./Constructor.types";

const ConstructorContainer: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();

  const [items, setItems] = useState<QuestionItem[]>([]);

  useEffect(() => {}, [quizId]);

  const save = async () => {
    alert("Сохранено");
  };

  return (
    <ConstructorView
      items={items}
      setItems={setItems}
      onSave={save}
    />
  );
};

export { ConstructorContainer };
