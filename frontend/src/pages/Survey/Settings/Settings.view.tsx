/* eslint-disable camelcase */
import React from "react";

import Checkbox from "@ui/Checkbox";
import Fieldset from "@ui/Fieldset";

import type { TSettingsViewProps } from "./Settings.types";

import pageStyles from "../Survey.module.scss";
import styles from "./Settings.module.scss";

import UrlConditions from "./UrlConditions";

const SettingsViewComponent: React.FC<TSettingsViewProps> = ({ settings, onChange }) => {
  const { block_scroll, prevent_repeat } = settings;

  return (
    <div className={pageStyles.page}>
      <h1 className={pageStyles.title}>Общие настройки опроса</h1>

      <section className={pageStyles.section}>
        <Fieldset legend="Флаги поведения">
          <Checkbox
            label="Блокировать прокрутку"
            inputProps={{
              id: "settings-checkbox-block-scroll",
              checked: block_scroll,
              onChange: e => onChange({ block_scroll: e.target.checked }),
            }}
          />
          <Checkbox
            label="Запретить повтор"
            inputProps={{
              id: "settings-checkbox-prevent-repeat",
              checked: prevent_repeat,
              onChange: e => onChange({ prevent_repeat: e.target.checked }),
            }}
          />
        </Fieldset>
      </section>
    </div>
  );
};

export default React.memo(SettingsViewComponent);
