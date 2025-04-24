import React, { ReactNode, useCallback, useContext, useState } from "react";

type TLayoutContextType = {
  /** Показывать/скрывать хедер ? */
  showHeader: boolean;
  /** Контент для хедера */
  headerContent: React.ReactNode | null;
  /** Функция для показа хедера */
  handleShowHeader(content: React.ReactNode): void;
  /** Функция для скрытия хедера */
  handleCloseHeader(): void;
};

const LayoutContext = React.createContext<TLayoutContextType | undefined>(undefined);

const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showHeader, setShowHeader] = useState<boolean>(false);
  const [headerContent, setHeaderContent] = useState<React.ReactNode | null>(null);

  /** Функция для показа хедера
   * @param {React.ReactNode} content - контент внутри хедера
   * @returns {void}
   */
  const handleShowHeader = useCallback((content: React.ReactNode): void => {
    setShowHeader(true);
    setHeaderContent(content);
  }, []);

  /** Функция для показа хедера
   * @returns {void}
   */
  const handleCloseHeader = useCallback((): void => {
    setShowHeader(false);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        showHeader,
        headerContent,
        handleShowHeader,
        handleCloseHeader,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error("");
  }

  return context;
};

export default LayoutProvider;
