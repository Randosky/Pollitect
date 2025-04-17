import React from "react";

import { Link } from "react-router-dom";

import styles from "./Home.module.scss";

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Добро пожаловать в конструктор опросов</h1>
        <p className={styles.subtitle}>
          Создавайте интерактивные опросы, собирайте обратную связь и анализируйте результаты в одном месте.
        </p>
        <div className={styles.ctaButtons}>
          <Link
            to="/login"
            className={styles.buttonPrimary}
          >
            Войти
          </Link>
          <Link
            to="/registration"
            className={styles.buttonSecondary}
          >
            Зарегистрироваться
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📝</div>
          <h3 className={styles.featureTitle}>Удобный редактор</h3>
          <p className={styles.featureDescription}>
            Добавляйте различные типы вопросов: одиночный выбор, текстовые поля, даты и многое другое.
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🎨</div>
          <h3 className={styles.featureTitle}>Гибкий дизайн</h3>
          <p className={styles.featureDescription}>
            Настраивайте внешний вид вашего опроса: цвета, шрифты, отступы и размещение виджета.
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📊</div>
          <h3 className={styles.featureTitle}>Аналитика</h3>
          <p className={styles.featureDescription}>
            Просматривайте статистику ответов: завершенности, среднее время прохождения и индивидуальные ответы.
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🔒</div>
          <h3 className={styles.featureTitle}>Безопасность</h3>
          <p className={styles.featureDescription}>
            Защищайте данные респондентов с помощью JWT, шифрования и согласий на обработку данных.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
