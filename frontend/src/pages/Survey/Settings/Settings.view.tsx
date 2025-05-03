/* eslint-disable camelcase */
import React, { useRef } from "react";

import Checkbox from "@ui/Checkbox";
import Fieldset from "@ui/Fieldset";
import { TextField } from "@ui/TextField";
import classNames from "classnames";

import type { TSettingsViewProps } from "./Settings.types";

import pageStyles from "../Survey.module.scss";
import styles from "./Settings.module.scss";

import UrlConditions from "./UrlConditions";

const SettingsView: React.FC<TSettingsViewProps> = ({ settings, onChange }) => {
  const { target_id, timer_sec, block_scroll, prevent_repeat, url_match_mode, url_pattern } = settings;

  /* сохранённые strict URL‑ы */
  const strictStore = useRef<string[]>(url_pattern.length > 1 ? url_pattern : [""]);

  /* таймер включён, если ≥ 0 */
  const timerEnabled = timer_sec >= 0;

  const timerSec = timer_sec >= 0 ? timer_sec : 0;
  const toggleTimer = (v: boolean) => onChange({ timer_sec: v ? timerSec : 0 });

  const switchMode = (m: "contains" | "equals") => {
    if (m === "equals") {
      onChange({ url_pattern: strictStore.current });
    } else {
      strictStore.current = url_pattern.length ? url_pattern : [""];

      onChange({ url_pattern: [url_pattern[0] ?? ""] });
    }

    onChange({ url_match_mode: m });
  };

  return (
    <div className={pageStyles.page}>
      <h1 className={pageStyles.title}>Общие настройки опроса</h1>

      <Fieldset legend="Базовые параметры">
        <TextField
          size="mobile"
          config={{
            labelProps: { value: "ID контейнера" },
            wrapperProps: { className: classNames(styles.input, styles.targetId) },
            inputProps: {
              id: "target_id",
              value: target_id ?? "",
              onChange: e => onChange({ target_id: e.target.value }),
            },
          }}
        />

        <div className={styles.timerRow}>
          <Checkbox
            label="Использовать таймер"
            inputProps={{
              id: "timer_enabled",
              checked: timerEnabled,
              onChange: e => toggleTimer(e.target.checked),
            }}
          />

          {timerEnabled && (
            <TextField
              size="mobile"
              config={{
                wrapperProps: { className: classNames(styles.input, styles.timerSec) },
                inputProps: {
                  id: "timer_sec",
                  type: "number",
                  min: 1,
                  value: timer_sec,
                  onChange: e => onChange({ timer_sec: +e.target.value }),
                },
              }}
            />
          )}
        </div>

        <div className={styles.flagsRow}>
          <Checkbox
            label="Блокировать прокрутку"
            inputProps={{
              id: "block_scroll",
              checked: block_scroll,
              onChange: e => onChange({ block_scroll: e.target.checked }),
            }}
          />
          <Checkbox
            label="Предотвращать повтор"
            inputProps={{
              id: "prevent_repeat",
              checked: prevent_repeat,
              onChange: e => onChange({ prevent_repeat: e.target.checked }),
            }}
          />
        </div>
      </Fieldset>

      <UrlConditions
        mode={url_match_mode}
        patterns={url_pattern}
        onModeChange={switchMode}
        onPatternsChange={p => onChange({ url_pattern: p })}
      />
    </div>
  );
};

export default React.memo(SettingsView);
