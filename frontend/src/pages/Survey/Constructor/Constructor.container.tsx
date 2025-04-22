import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import ConstructorView from "./Constructor.view";

import type { QuestionItem } from "./Constructor.types";

const ConstructorContainer: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();

  const [items, setItems] = useState<QuestionItem[]>([]);

  useEffect(() => {}, [surveyId]);

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
