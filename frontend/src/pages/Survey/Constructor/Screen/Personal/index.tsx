/* eslint-disable camelcase */
import React, { CSSProperties, useCallback, useMemo } from "react";

import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";
import { useAppSelector } from "@store/hooks";
import Checkbox from "@ui/Checkbox";
import Select from "@ui/Select";
import { TextField } from "@ui/TextField";
import classNames from "classnames";

import type { TPersonalScreen, TScreenDesignSettings } from "@pages/Survey/Survey.types";

import screenStyles from "../Screen.module.scss";
import styles from "./Personal.module.scss";

const PersonalScreen: React.FC = React.memo(() => {
  const { id, personalScreen } = useAppSelector(s => s.survey.surveyForm);
  const { saveSurvey } = useSurveyController();

  /** Сохраняем только contactScreen */
  const saveForm = useCallback(
    (newForm: TPersonalScreen) => saveSurvey(id, { personalScreen: newForm }),
    [id, saveSurvey]
  );

  const { form, setForm } = useFormWithFooter<TPersonalScreen>(personalScreen, saveForm);

  /** обработка обычных полей */
  const handleField = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked } = e.currentTarget as HTMLInputElement;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  /** обработка design_settings */
  const handleDesign = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setForm(prev => ({
      ...prev,
      design_settings: {
        ...prev.design_settings,
        [name as keyof TScreenDesignSettings]: value,
      },
    }));
  }, []);

  /** стили для body */
  const stylesBody = useMemo<CSSProperties>(() => {
    return form.design_settings.layout === "image_background"
      ? {
          backgroundImage: `url(${form.design_settings.image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {};
  }, [form.design_settings]);

  /** стили для content */
  const stylesContent = useMemo<CSSProperties>(() => {
    switch (form.design_settings.alignment) {
      case "left":
        return { alignItems: "flex-start" };

      case "right":
        return { alignItems: "flex-end" };

      case "center":

      default:
        return { alignItems: "center" };
    }
  }, [form.design_settings.alignment]);

  return (
    <article className={screenStyles.screen}>
      <Checkbox
        label={form.active ? "Активен" : "Выключен"}
        inputProps={{
          id: "active",
          name: "active",
          checked: form.active,
          onChange: handleField,
        }}
      />

      <div
        style={stylesBody}
        className={classNames(screenStyles.body, styles.body)}
      >
        <div
          className={screenStyles.content}
          style={stylesContent}
        >
          <div className={screenStyles.headerContainer}>
            <TextField
              size="mobile"
              config={{
                wrapperProps: { className: screenStyles.inputWrapper },
                inputProps: {
                  name: "title",
                  id: "welcome-screen-title",
                  placeholder: "Заголовок",
                  className: screenStyles.header,
                  value: form?.title ?? "",
                  onChange: handleField,
                },
              }}
            />

            <TextField
              size="mobile"
              type="textarea"
              config={{
                wrapperProps: { className: screenStyles.inputWrapper },
                textAreaProps: {
                  name: "description",
                  id: "welcome-screen-description",
                  placeholder: "Описание",
                  className: screenStyles.description,
                  value: form?.description ?? "",
                  onChange: handleField,
                  rows: 3,
                },
              }}
            />
          </div>
        </div>

        <form className={styles.form}>
          <TextField
            size="mobile"
            config={{ inputProps: { placeholder: "Имя" } }}
          />
          <TextField
            size="mobile"
            config={{ inputProps: { placeholder: "Email" } }}
          />
          <TextField
            size="mobile"
            config={{ inputProps: { placeholder: "Телефон" } }}
          />
          <TextField
            size="mobile"
            config={{ inputProps: { placeholder: "Комментарий" } }}
          />

          <TextField
            size="mobile"
            config={{
              containerProps: { className: classNames(screenStyles.buttonContainer, styles.buttonContainer) },
              wrapperProps: { className: classNames(screenStyles.buttonWrapper, styles.buttonWrapper) },
              inputProps: {
                name: "button_text",
                id: "welcome-screen-button_text",
                placeholder: "Отправить",
                className: screenStyles.button,
                value: form.button_text,
                onChange: handleField,
              },
            }}
          />

          <span className={styles.legalInfo}>
            Отправляя форму, я принимаю условия{" "}
            <a
              href="/"
              target="_blank"
            >
              политики конфиденциальности
            </a>{" "}
            и даю согласие на обработку моих{" "}
            <a
              href="/"
              target="_blank"
            >
              персональных данных
            </a>
          </span>
        </form>
      </div>

      <div className={screenStyles.footer}>
        <Select
          size="mobile"
          name="layout"
          value={form.design_settings.layout}
          onChange={handleDesign}
        >
          <option value="without_image">Без картинки</option>
          <option value="image_background">Фон‑картинка</option>
        </Select>

        <Select
          size="mobile"
          name="alignment"
          value={form.design_settings.alignment}
          onChange={handleDesign}
        >
          <option value="left">Слева</option>
          <option value="center">Центр</option>
          <option value="right">Справа</option>
        </Select>

        {form.design_settings.layout !== "without_image" && (
          <TextField
            size="mobile"
            config={{
              inputProps: {
                name: "image_url",
                placeholder: "URL картинки",
                value: form.design_settings.image_url || "",
                onChange: handleDesign,
              },
            }}
          />
        )}
      </div>
    </article>
  );
});

PersonalScreen.displayName = "ContactScreen";
export default PersonalScreen;
