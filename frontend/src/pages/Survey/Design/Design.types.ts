export type WidgetPlacement = "embedded" | "left" | "right";

export interface DesignSettings {
  widgetPlacement: WidgetPlacement;
  width: number;
  widthUnit: "%" | "px";
  height: number;
  heightUnit: "%" | "px";
  bgColor: string;
  textColor: string;
  buttonColor: string;
  fontFamily: string;
  padding: number;
  margin: number;
}

export interface TDesignViewProps {
  settings: DesignSettings;
  onChange: (s: DesignSettings) => void;
  onSave: () => void;
}
