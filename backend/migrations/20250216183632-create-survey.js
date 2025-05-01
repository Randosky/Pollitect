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
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      questions: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      welcomeScreen: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      personalScreen: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      completionScreen: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      design_settings: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      display_settings: {
        type: Sequelize.JSONB,
        allowNull: false,
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
