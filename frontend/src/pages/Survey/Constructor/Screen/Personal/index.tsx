import React, { CSSProperties, useCallback, useMemo } from "react";

import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { closeModal, openModal } from "@store/slices/layout";
import Button from "@ui/Button";
import Checkbox from "@ui/Checkbox";
import Select from "@ui/Select";
import { TextField } from "@ui/TextField";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { PERSONAL_SCREEN_FIELDS } from "../../Constuctor.config";

import type { TPersonalScreen, TScreenDesignSettings, TScreenPersonalField } from "@pages/Survey/Survey.types";

import screenStyles from "../Screen.module.scss";
import styles from "./Personal.module.scss";

import AddFieldModal from "./AddFieldModal";

const PersonalScreen: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();

  const { id, personalScreen } = useAppSelector(s => s.survey.surveyForm);
  const { saveSurvey } = useSurveyController();

  /** Сохраняем только contactScreen */
  const saveForm = useCallback(
    (newForm: TPersonalScreen) => saveSurvey(id, { personalScreen: newForm }),
    [id, saveSurvey]
  );

  const { form, setForm } = useFormWithFooter<TPersonalScreen>(personalScreen, saveForm);

  const existing = form.personal_fields?.map(f => f.type) ?? [];

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

  /** Добавить новое */
  const handleAdd = useCallback(() => {
    dispatch(
      openModal({
        content: (
          <AddFieldModal
            existingTypes={existing}
            onSave={field => {
              setForm(prev => ({
                ...prev,
                personal_fields: [...(prev.personal_fields || []), field],
              }));
              dispatch(closeModal());
            }}
            onCancel={() => dispatch(closeModal())}
          />
        ),
      })
    );
  }, [dispatch, existing, setForm]);

  /** Редактировать */
  const handleEdit = useCallback(
    (field: TScreenPersonalField, idx: number) => {
      dispatch(
        openModal({
          content: (
            <AddFieldModal
              existingTypes={existing}
              initial={field}
              index={idx}
              onSave={(updated, index) => {
                setForm(prev => {
                  const pf = [...(prev.personal_fields || [])];

                  pf[index!] = updated;

                  return { ...prev, personal_fields: pf };
                });
                dispatch(closeModal());
              }}
              onCancel={() => dispatch(closeModal())}
            />
          ),
        })
      );
    },
    [dispatch, existing, setForm]
  );

  /** Удалить */
  const handleRemove = useCallback(
    (idx: number) => {
      setForm(prev => ({
        ...prev,
        personal_fields: prev.personal_fields?.filter((_, i) => i !== idx),
      }));
    },
    [setForm]
  );

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
          {form.personal_fields?.map((personal, index) => (
            <div
              key={personal.type}
              className={styles.field}
            >
              <label
                htmlFor={personal.type}
                className={styles.field__label}
              >
                <span>
                  {personal.label} <span className={personal.required ? styles.field__required : ""} />
                </span>
              </label>

              <div className={styles.field__content}>
                <TextField
                  size="mobile"
                  config={{ inputProps: { id: personal.type, disabled: true, placeholder: personal.placeholder } }}
                />

                <div className={styles.field__actions}>
                  <span
                    tabIndex={0}
                    role="button"
                    className={classNames("icon-edit", styles.field__edit)}
                    onClick={() => handleEdit(personal, index)}
                    onKeyDown={e => e.code === "Enter" && handleEdit(personal, index)}
                  />

                  <span
                    tabIndex={0}
                    role="button"
                    className={classNames("icon-trash", styles.field__remove)}
                    onClick={() => handleRemove(index)}
                    onKeyDown={e => e.code === "Enter" && handleRemove(index)}
                  />
                </div>
              </div>
            </div>
          ))}

          {(form.personal_fields?.length || 0) < PERSONAL_SCREEN_FIELDS.length && (
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className={styles.field__addButton}
            >
              + Добавить поле
            </Button>
          )}

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
            <Link
              to="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.legalInfo__link}
            >
              политики конфиденциальности
            </Link>{" "}
            и даю согласие на обработку моих{" "}
            <Link
              to="/personal-data"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.legalInfo__link}
            >
              персональных данных
            </Link>
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
          <option disabled>Расположение картинки</option>
          <option value="without_image">Без картинки</option>
          <option value="image_background">Фон‑картинка</option>
        </Select>

        <Select
          size="mobile"
          name="alignment"
          value={form.design_settings.alignment}
          onChange={handleDesign}
        >
          <option disabled>Выравнивание текста</option>
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
