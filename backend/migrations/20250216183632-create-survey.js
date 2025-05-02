"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Запуск миграции: Создание таблицы Surveys");
    await queryInterface.createTable("Surveys", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      questions: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      welcomeScreen: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      personalScreen: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      completionScreen: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      design_settings: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      display_settings: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      responses: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      statistics: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    console.log("Откат миграции: Удаление таблицы Surveys");
    await queryInterface.dropTable("Surveys");
  },
};
