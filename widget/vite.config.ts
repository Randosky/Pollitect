import babel from "@rollup/plugin-babel";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@components": "src/widget/components",
      "@services": "src/widget/services",
      "@utils": "src/widget/utils",
      "@widget": "src/widget",
      "@": "src",
    },
  },
  build: {
    target: ["es2015"], // Совместимость с браузерами, поддерживающими хотя бы ES2015
    rollupOptions: {
      input: "src/index.ts",
      output: {
        entryFileNames: "pollitect.js",
      },
      // input: {
      //   survey: path.resolve(__dirname, "src/widget/Survey.ts"),
      //   surveyExternal: path.resolve(__dirname, "src/widget/Survey.external.ts"),
      // },
      // output: {
      //   // Для каждого entry файла будет создан свой js файл
      //   entryFileNames: "[name].js", // Название файла будет таким же, как и у входного файла
      //   chunkFileNames: "[name]-[hash].js", // Уникальные имена для чанков
      //   inlineDynamicImports: false, // Отключаем динамические импорты
      // },
    },
  },
  plugins: [
    babel({
      babelHelpers: "bundled", // Используем bundled для компактности
      extensions: [".js", ".ts"],
      include: "src/**/*", // Включаем все файлы в src
      exclude: "node_modules/**", // Исключаем node_modules
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "> 0.25%, not dead", // Настройка для поддержки старых браузеров
            useBuiltIns: "entry", // Включаем полифилы
            corejs: 3, // Используем полифилы из core-js версии 3
          },
        ],
        "@babel/preset-typescript", // Для работы с TypeScript
      ],
    }),
  ],
});
