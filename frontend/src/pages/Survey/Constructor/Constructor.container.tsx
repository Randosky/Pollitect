// src/pages/Constructor/ConstructorContainer.tsx
import React, { useEffect, useState } from "react";

import {
  updateCompletionScreen,
  updatePersonalScreen,
  updateSurveyForm,
  updateWelcomeScreen,
} from "@store/slices/survey";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import ConstructorView from "./Constructor.view";

import type { TCompletionScreen, TPersonalScreen, TQuestion, TWelcomeScreen } from "../Survey.types";

function deepEqual(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const ConstructorContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { surveyId } = useParams<{ surveyId: string }>();
  const {
    questions: storedQuestions,
    welcomeScreen: storedWelcome,
    personalScreen: storedPersonal,
    completionScreen: storedCompletion,
  } = useAppSelector(s => s.survey.surveyForm);

  const [questions, setQuestions] = useState<TQuestion[]>(storedQuestions);
  const [welcome, setWelcome] = useState<TWelcomeScreen>(storedWelcome);
  const [personal, setPersonal] = useState<TPersonalScreen>(storedPersonal);
  const [completion, setCompletion] = useState<TCompletionScreen>(storedCompletion);

  // Mirror store → local, but only when *really* changed
  useEffect(() => {
    if (!deepEqual(storedQuestions, questions)) {
      setQuestions(storedQuestions);
    }
  }, [storedQuestions]);
  useEffect(() => {
    if (!deepEqual(storedWelcome, welcome)) {
      setWelcome(storedWelcome);
    }
  }, [storedWelcome]);
  useEffect(() => {
    if (!deepEqual(storedPersonal, personal)) {
      setPersonal(storedPersonal);
    }
  }, [storedPersonal]);
  useEffect(() => {
    if (!deepEqual(storedCompletion, completion)) {
      setCompletion(storedCompletion);
    }
  }, [storedCompletion]);

  // Sync local → store (debounced) only when different
  useEffect(() => {
    if (!deepEqual(storedQuestions, questions)) {
      const h = setTimeout(() => {
        dispatch(updateSurveyForm({ questions }));
      }, 300);

      return () => clearTimeout(h);
    }
  }, [questions, storedQuestions, dispatch]);

  useEffect(() => {
    if (!deepEqual(storedWelcome, welcome)) {
      const h = setTimeout(() => {
        dispatch(updateWelcomeScreen(welcome));
      }, 300);

      return () => clearTimeout(h);
    }
  }, [welcome, storedWelcome, dispatch]);

  useEffect(() => {
    if (!deepEqual(storedPersonal, personal)) {
      const h = setTimeout(() => {
        dispatch(updatePersonalScreen(personal));
      }, 300);

      return () => clearTimeout(h);
    }
  }, [personal, storedPersonal, dispatch]);

  useEffect(() => {
    if (!deepEqual(storedCompletion, completion)) {
      const h = setTimeout(() => {
        dispatch(updateCompletionScreen(completion));
      }, 300);

      return () => clearTimeout(h);
    }
  }, [completion, storedCompletion, dispatch]);

  const save = async () => {
    // e.g. POST to API
    alert("Опрос сохранён");
  };

  return (
    <ConstructorView
      welcome={welcome}
      questions={questions}
      personal={personal}
      completion={completion}
      setQuestions={setQuestions}
      updateWelcome={upd => setWelcome(p => ({ ...p, ...upd }))}
      updatePersonal={upd => setPersonal(p => ({ ...p, ...upd }))}
      updateCompletion={upd => setCompletion(p => ({ ...p, ...upd }))}
      onSave={save}
    />
  );
};

export { ConstructorContainer };
