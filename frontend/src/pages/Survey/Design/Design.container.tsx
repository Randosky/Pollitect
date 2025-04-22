import React, { useEffect, useState } from "react";

import { updateDesignSettings } from "@store/slices/survey";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import DesignView from "./Design.view";

import { TDesignSettings } from "../Survey.types";

const DesignContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const stored = useAppSelector(s => s.survey.surveyForm.design_settings);
  const [settings, setSettings] = useState<TDesignSettings>(stored);

  useEffect(() => {
    setSettings(stored);
  }, [stored]);

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(updateDesignSettings(settings));
    }, 300);

    return () => clearTimeout(id);
  }, [settings, dispatch]);

  const handleChange = (newSettings: TDesignSettings) => {
    setSettings(newSettings);
  };

  const handleSave = () => {
    dispatch(updateDesignSettings(settings));

    alert("Дизайн сохранён");
  };

  return (
    <DesignView
      settings={settings}
      onChange={handleChange}
      onSave={handleSave}
    />
  );
};

export { DesignContainer };
