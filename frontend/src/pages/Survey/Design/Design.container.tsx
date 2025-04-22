import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import DesignView from "./Design.view";

import type { DesignSettings } from "./Design.types";

const defaultSettings: DesignSettings = {
  widgetPlacement: "embedded",
  width: 100,
  widthUnit: "%",
  height: 400,
  heightUnit: "px",
  bgColor: "#ffffff",
  textColor: "#000000",
  buttonColor: "#00bcd4",
  fontFamily: "Open Sans",
  padding: 16,
  margin: 16,
};

const DesignContainer: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const [settings, setSettings] = useState<DesignSettings>(defaultSettings);

  useEffect(() => {}, [surveyId]);

  const save = async () => {
    alert("Дизайн сохранён");
  };

  return (
    <DesignView
      settings={settings}
      onChange={setSettings}
      onSave={save}
    />
  );
};

export { DesignContainer };
