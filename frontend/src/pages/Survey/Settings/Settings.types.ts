export interface Settings {
  htmlTargetId: string;
  blockScroll: boolean;
  preventRepeat: boolean;
  timerSec: number;
  urlMatchMode: "contains" | "equals";
  urlPattern: string;
}

export interface TSettingsViewProps {
  settings: Settings;
  onChange: (s: Settings) => void;
  onSave: () => void;
  embedCode: string;
}
