export type QuestionType =
  | "single"
  | "multi"
  | "binary"
  | "dropdown"
  | "text"
  | "textarea"
  | "date"
  | "welcome"
  | "personal"
  | "completion";

export interface BaseItem {
  type: QuestionType;
  title: string;
  description: string;
}

export interface QuestionItem extends BaseItem {
  options?: string[];
}

export interface ConstructorState {
  items: QuestionItem[];
}
