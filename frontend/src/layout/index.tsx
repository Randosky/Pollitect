import { StrictMode, useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const html = document.querySelector("html");

    html?.setAttribute("translate", "no");

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
            <LayoutHeader />

            <LayoutContainer>
              <AppRouter />

              <Modal />
              <Toaster />
            </LayoutContainer>
          </ErrorBoundary>
        </Provider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default Layout;
