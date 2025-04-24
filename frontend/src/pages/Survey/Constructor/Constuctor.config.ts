import type { TPersonalFieldType } from "../Survey.types";
import type { TQuestionType } from "../Survey.types";

export const QUESTION_TYPES: TQuestionType[] = ["single", "text", "binary", "dropdown", "textarea", "date"];

export const PERSONAL_SCREEN_FIELDS: TPersonalFieldType[] = ["name", "email", "phone", "address"];
