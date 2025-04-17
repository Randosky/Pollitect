import { StrictMode, useEffect, useRef, useState } from "react";

import { store } from "@store/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import styles from "./Layout.module.scss";

import AppRouter from "../router/routes";

import LayoutContainer from "./Container";
import ErrorBoundary from "./ErrorBoundary";
import LayoutHeader from "./Header";
import Modal from "./Modal";
import Toaster from "./Toaster";

/** Лейаут для проекта в кабинете */
const Layout = () => {
  const headerRef = useRef<HTMLElement | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const html = document.documentElement;

    html.setAttribute("translate", "no");

    if (headerRef.current) {
      const h = headerRef.current.offsetHeight;

      html.style.setProperty("--header-height", `${h}px`);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <main className={styles.main}>Загрузка</main>;
  }

  return (
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <ErrorBoundary>
            <div className={styles.wrapper}>
              <LayoutHeader ref={headerRef} />

              <LayoutContainer>
                <AppRouter />

                <Modal />
                <Toaster />
              </LayoutContainer>
            </div>
          </ErrorBoundary>
        </Provider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default Layout;
