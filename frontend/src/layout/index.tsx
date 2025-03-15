import { StrictMode, useEffect, useState } from "react";

import { store } from "@store/store";
import { Provider } from "react-redux";

import styles from "./Layout.module.scss";

import AppRouter from "../router/routes";

// import Modal from "./Modal";
// import Toaster from "./Toaster";

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
      <Provider store={store}>
        <main className={styles.main}>
          <AppRouter />

          {/* <Modal />
          <Toaster /> */}
        </main>
      </Provider>
    </StrictMode>
  );
};

export default Layout;
