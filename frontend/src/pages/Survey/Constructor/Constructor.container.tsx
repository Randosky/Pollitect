import React, { useCallback, useState } from "react";

import ConstructorView from "./Constructor.view";

import { TConstuctorTabs } from "./Constructor.types";

const ConstructorContainer: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TConstuctorTabs>("welcome");

  const handleSetCurrentTab = useCallback((tab: TConstuctorTabs) => setCurrentTab(tab), []);

  return (
    <ConstructorView
      currentTab={currentTab}
      setCurrentTab={handleSetCurrentTab}
    />
  );
};

export { ConstructorContainer };
