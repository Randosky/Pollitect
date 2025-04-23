export type TConstuctorTabs = "welcome" | "questions" | "personal" | "completion";

export type TConstuctorViewProps = {
  currentTab: TConstuctorTabs;
  setCurrentTab(tab: TConstuctorTabs): void;
};
