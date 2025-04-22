import React, { useEffect, useState } from "react";

import { updateDisplaySettings } from "@store/slices/survey";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import SettingsView from "./Settings.view";

import { TDisplaySettings } from "../Survey.types";

const SettingsContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const stored = useAppSelector(s => s.survey.surveyForm.display_settings);
  const [settings, setSettings] = useState<TDisplaySettings>(stored);
  const [embedCode, setEmbedCode] = useState<string>("");

  useEffect(() => {
    setSettings(stored);
  }, [stored]);

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(updateDisplaySettings(settings));
    }, 300);

    return () => clearTimeout(id);
  }, [settings, dispatch]);

  const handleChange = (newSettings: TDisplaySettings) => {
    setSettings(newSettings);
  };

  const handleSave = () => {
    dispatch(updateDisplaySettings(settings));
    const code = `<script src="https://your.cdn/widget.js"
  data-blockscroll="${settings.block_scroll}"
  data-preventrepeat="${settings.prevent_repeat}"
  data-timersec="${settings.timer_sec}"
  data-urlmode="${settings.url_match_mode}"></script>`;

    setEmbedCode(code);
  };

  return (
    <SettingsView
      settings={settings}
      embedCode={embedCode}
      onChange={handleChange}
      onSave={handleSave}
    />
  );
};

export { SettingsContainer };
