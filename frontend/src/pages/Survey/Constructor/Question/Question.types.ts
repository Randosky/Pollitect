import type { TQuestion } from "@pages/Survey/Survey.types";

export interface IQuestionProps {
  item: TQuestion;
  onChange: (upd: Partial<TQuestion>) => void;
}
