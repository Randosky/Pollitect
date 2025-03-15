import React from "react";

import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <React.Fragment>
      <h1>Это начальная страница</h1>

      <article>
        <h2>Зарегистрируйтесь или войдите в свой аккаунт</h2>

        <Link to="login">Войти</Link>
        <Link to="registration">Зарегистрироваться</Link>
      </article>
    </React.Fragment>
  );
};

export default HomePage;
