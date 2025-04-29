// src/pages/Home/Home.tsx
import React from "react";

import { Link } from "react-router-dom";

import styles from "./Home.module.scss";

const Home: React.FC = () => (
  <div className={styles.container}>
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <h1 className={styles.title}>Конструктор интерактивных интегрируемых опросов</h1>

        <p className={styles.subtitle}>
          Создавайте интерактивные опросы, собирайте обратную связь и анализируйте результаты в одном месте.
        </p>

        <Link
          to="/login"
          className={styles.buttonPrimary}
        >
          Создать опрос
        </Link>
      </div>

      <div className={styles.heroImage}></div>
    </section>

    <section className={styles.features}>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>📝</div>
        <h3 className={styles.featureTitle}>Удобный редактор</h3>
        <p className={styles.featureDescription}>
          Добавляйте разные типы вопросов: одиночный и множественный выбор, текстовые поля и многое другое.
        </p>
      </div>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>🎨</div>
        <h3 className={styles.featureTitle}>Гибкий дизайн</h3>
        <p className={styles.featureDescription}>Настраивайте цвета, шрифты и расположение виджета под ваш бренд.</p>
      </div>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>📊</div>
        <h3 className={styles.featureTitle}>Аналитика</h3>
        <p className={styles.featureDescription}>
          Отслеживайте процент завершённых опросов, среднее время ответа и детали каждого респондента.
        </p>
      </div>
      <div className={styles.featureCard}>
        <div className={styles.featureIcon}>🔒</div>
        <h3 className={styles.featureTitle}>Безопасность</h3>
        <p className={styles.featureDescription}>Защищайте данные респондентов с помощью JWT‑токенов и шифрования.</p>
      </div>
    </section>
  </div>
);

export default Home;
