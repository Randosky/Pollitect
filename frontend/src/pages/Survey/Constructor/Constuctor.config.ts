import type { TPersonalFieldType, TQuestionType } from "../Survey.types";
import type { IQuestionProps } from "./Question/Questions.types";

import { Binary } from "./Question/Binary";
import { DateQuestion } from "./Question/Date";
import { Dropdown } from "./Question/Dropdown";
import { Multi } from "./Question/Multi";
import { Single } from "./Question/Single";
import { Text } from "./Question/Text";
import { Textarea } from "./Question/Textarea";

export const QUESTION_COMPONENTS: Record<TQuestionType, React.FC<IQuestionProps>> = {
  single: Single,
  multi: Multi,
  binary: Binary,
  dropdown: Dropdown,
  text: Text,
  textarea: Textarea,
  date: DateQuestion,
};

export const PERSONAL_SCREEN_FIELDS: TPersonalFieldType[] = ["name", "email", "phone", "address"];
