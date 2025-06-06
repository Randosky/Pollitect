import React from "react";

import styles from "./PersonalDataPolicy.module.scss";

const PersonalDataPolicy = () => (
  <section className={styles.page}>
    <h1 className={styles.heading}>Политика обработки персональных данных</h1>
    <p className={styles.paragraph}>
      Веб-сервис &quot;Pollitect&quot; осуществляет обработку персональных данных пользователей строго в соответствии с
      законодательством Российской Федерации, включая Федеральный закон №&nbsp;152-ФЗ &laquo;О персональных
      данных&raquo;.
    </p>
    <p className={styles.paragraph}>
      1. Под персональными данными понимается информация, позволяющая идентифицировать пользователя: имя, электронная
      почта, номер телефона, IP-адрес и иные сведения.
    </p>
    <p className={styles.paragraph}>
      2. Целью обработки является предоставление доступа к функционалу сервиса, участие в опросах, анализ статистики и
      улучшение качества услуг.
    </p>
    <p className={styles.paragraph}>
      3. Обработка данных включает сбор, систематизацию, хранение, обновление, использование и удаление.
    </p>
    <p className={styles.paragraph}>
      4. Пользователь предоставляет согласие на обработку персональных данных при прохождении опроса или регистрации в
      системе.
    </p>
    <p className={styles.paragraph}>
      5. Пользователь имеет право отозвать согласие, а также требовать уточнения или удаления своих данных.
    </p>
    <p className={styles.paragraph}>
      6. Все персональные данные защищены техническими средствами и организационными мерами, исключающими
      несанкционированный доступ.
    </p>
  </section>
);

export default PersonalDataPolicy;
