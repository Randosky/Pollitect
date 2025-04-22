import type { TDisplaySettings } from "../Survey.types";

export interface TSettingsViewProps {
  settings: TDisplaySettings;
  embedCode: string;
  onChange: (settings: TDisplaySettings) => void;
  onSave: () => void;
}
