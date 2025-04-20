import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import SettingsView from "./Settings.view";

import type { Settings } from "./Settings.types";

const defaultSettings: Settings = {
  htmlTargetId: "survey-widget",
  blockScroll: false,
  preventRepeat: false,
  timerSec: 0,
  urlMatchMode: "contains",
  urlPattern: window.location.origin,
};

const SettingsContainer: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [embed, setEmbed] = useState("");

  useEffect(() => {}, [quizId]);

  const save = async () => {
    setEmbed(
      `<script src="https://your.cdn/widget.js"
 data-id="${quizId}"
 data-target="${settings.htmlTargetId}"
 data-blockscroll="${settings.blockScroll}"
 data-preventrepeat="${settings.preventRepeat}"
 data-timer="${settings.timerSec}"
 data-urlmode="${settings.urlMatchMode}"
 data-url="${settings.urlPattern}"></script>`
    );
    alert("Настройки сохранены");
  };

  return (
    <SettingsView
      settings={settings}
      onChange={setSettings}
      onSave={save}
      embedCode={embed}
    />
  );
};

export { SettingsContainer };
