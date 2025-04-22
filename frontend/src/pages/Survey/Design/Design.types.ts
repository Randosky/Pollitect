import type { TDesignSettings } from "../Survey.types";

export interface TDesignViewProps {
  settings: TDesignSettings;
  onChange: (settings: TDesignSettings) => void;
  onSave: () => void;
}
