import React, { ReactNode, useCallback, useContext, useState } from "react";

type TLayoutFooterContextType = {
  /** Показывать/скрывать футер ? */
  showFooter: boolean;
  /** Контент для футера */
  footerContent: React.ReactNode | null;
  /** Функция для показа футера */
  handleShowFooter(content: React.ReactNode): void;
  /** Функция для скрытия футера */
  handleCloseFooter(): void;
};

const LayoutFooterContext = React.createContext<TLayoutFooterContextType | undefined>(undefined);

const LayoutFooterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showFooter, setShowFooter] = useState<boolean>(false);
  const [footerContent, setFooterContent] = useState<React.ReactNode | null>(null);

  /** Функция для показа хедера
   * @param {React.ReactNode} content - контент внутри хедера
   * @returns {void}
   */
  const handleShowFooter = useCallback((content: React.ReactNode): void => {
    setShowFooter(true);
    setFooterContent(content);
  }, []);

  /** Функция для показа хедера
   * @returns {void}
   */
  const handleCloseFooter = useCallback((): void => {
    setShowFooter(false);
  }, []);

  return (
    <LayoutFooterContext.Provider
      value={{
        showFooter,
        footerContent,
        handleShowFooter,
        handleCloseFooter,
      }}
    >
      {children}
    </LayoutFooterContext.Provider>
  );
};

export const useLayoutFooter = () => {
  const context = useContext(LayoutFooterContext);

  if (!context) {
    throw new Error("");
  }

  return context;
};

export default LayoutFooterProvider;
