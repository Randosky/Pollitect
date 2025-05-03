import type { TDisplaySettings } from "../Survey.types";

export interface TSettingsViewProps {
  settings: TDisplaySettings;
  onChange: (settings: Partial<TDisplaySettings>) => void;
}
