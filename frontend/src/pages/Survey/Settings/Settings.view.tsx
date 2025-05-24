import React, { useEffect, useState } from "react";

import Checkbox from "@ui/Checkbox";
import Fieldset from "@ui/Fieldset";
import { TextField } from "@ui/TextField";
import classNames from "classnames";

import { SECONDS_IN_MIN } from "@/config";

import type { TSettingsViewProps } from "./Settings.types";

import pageStyles from "../Survey.module.scss";
import styles from "./Settings.module.scss";

import UrlConditions from "./UrlConditions";

const MAX_MINUTS = 999;

const SettingsView: React.FC<TSettingsViewProps> = ({ settings, onChange }) => {
  const { target_id, timer_sec, block_scroll, prevent_repeat, url_match_mode, url_pattern } = settings;

  /* таймер включён, если ≥ 0 */
  const timerEnabled = timer_sec >= 0;

  const [minutes, setMinutes] = useState(() => Math.floor(Math.max(timer_sec, 0) / SECONDS_IN_MIN));
  const [seconds, setSeconds] = useState(() => Math.max(timer_sec, 0) % SECONDS_IN_MIN);

  // При изменении внешнего timer_sec, обновляем локальные стейты
  useEffect(() => {
    if (timerEnabled) {
      setMinutes(Math.floor(timer_sec / SECONDS_IN_MIN));
      setSeconds(timer_sec % SECONDS_IN_MIN);
    }
  }, [timer_sec]);

  const handleMinutesChange = (value: string) => {
    let newMinutes = parseInt(value, 10);

    /** Если меньше нуля или не валидное */
    if (isNaN(newMinutes) || newMinutes < 0) {
      newMinutes = 0;
    }

    /** Если больше максимального */
    if (newMinutes >= MAX_MINUTS) {
      newMinutes = MAX_MINUTS;
    }

    const newTimerSec = newMinutes * SECONDS_IN_MIN + seconds;

    setMinutes(newMinutes);
    onChange({ timer_sec: newTimerSec });
  };

  const handleSecondsChange = (value: string) => {
    let newSeconds = parseInt(value, 10);

    /** Если меньше нуля или не валидное */
    if (isNaN(newSeconds) || newSeconds < 0) {
      newSeconds = 0;
    }

    /** Если больше максимально допустимого (59 сек) */
    if (newSeconds >= SECONDS_IN_MIN) {
      newSeconds = SECONDS_IN_MIN - 1;
    }

    const newTimerSec = minutes * SECONDS_IN_MIN + newSeconds;

    setSeconds(newSeconds);
    onChange({ timer_sec: newTimerSec });
  };

  const handleTimerToggle = (enabled: boolean) => {
    if (enabled) {
      const total = minutes * SECONDS_IN_MIN + seconds;

      onChange({ timer_sec: total });
    } else {
      onChange({ timer_sec: -1 });
    }
  };

  return (
    <div className={pageStyles.page}>
      <h1 className={pageStyles.title}>Общие настройки опроса</h1>

      <Fieldset legend="Базовые параметры">
        <TextField
          size="mobile"
          config={{
            labelProps: { value: "Идентификатор контейнера (куда вставить опрос)" },
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
              onChange: e => handleTimerToggle(e.target.checked),
            }}
          />

          {timerEnabled && (
            <div className={styles.timerInputs}>
              <TextField
                size="mobile"
                config={{
                  containerProps: { className: styles.timerInput },
                  inputProps: {
                    id: "timer_min",
                    type: "number",
                    min: 0,
                    max: 999,
                    value: minutes.toString(),
                    onChange: e => handleMinutesChange(e.currentTarget.value),
                  },
                }}
              >
                <span className={styles.hint}>мин</span>
              </TextField>

              <TextField
                size="mobile"
                config={{
                  containerProps: { className: styles.timerInput },
                  inputProps: {
                    id: "timer_sec",
                    type: "number",
                    min: 0,
                    max: 59,
                    value: seconds,
                    onChange: e => handleSecondsChange(e.currentTarget.value),
                  },
                }}
              >
                <span className={styles.hint}>сек</span>
              </TextField>
            </div>
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
        onModeChange={m => onChange({ url_match_mode: m })}
        onPatternsChange={p => onChange({ url_pattern: p })}
      />
    </div>
  );
};

export default React.memo(SettingsView);
