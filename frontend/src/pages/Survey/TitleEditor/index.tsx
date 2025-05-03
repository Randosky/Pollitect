import React from "react";

import { useError } from "@hooks/useError";
import { useSurveyController } from "@hooks/useSurveyController";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { updateSurveyForm } from "@store/slices/survey";
import { useDebounce } from "@uidotdev/usehooks";
import { useParams } from "react-router-dom";

import { TextField } from "@/ui/TextField";

const MIN_LENGTH = 3;
const DEBOUCE_TIME = 500;

/**
 * Инпут для редактирования названия опроса с debounce‑обновлением на сервере.
 */
const TitleEditor: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const surveyIdNumber = Number(surveyId);

  const currentTitle = useAppSelector(s => s.survey.surveyForm.title);

  const [title, setTitle] = React.useState(currentTitle);

  const processError = useError();
  const dispatch = useAppDispatch();
  const { saveSurvey } = useSurveyController();

  const debounced = useDebounce(title, DEBOUCE_TIME);

  /** Отправляем PATCH, когда debounced‑значение изменилось */
  React.useEffect(() => {
    if (debounced === currentTitle) return;

    const patch = async () => {
      try {
        const data = await saveSurvey(surveyIdNumber, { title: debounced });

        if (!data) return;

        dispatch(updateSurveyForm(data));
      } catch (e) {
        processError(e);
      }
    };

    if (debounced.trim().length >= MIN_LENGTH) patch();
  }, [debounced]);

  return (
    <TextField
      type="input"
      config={{
        inputProps: {
          value: title,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
          placeholder: "Введите название...",
        },
      }}
    />
  );
};

export default TitleEditor;
