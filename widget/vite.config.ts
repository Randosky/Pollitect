import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    legacy({
      targets: ["defaults", "ie >= 11"], // Поддержка IE11 и старых браузеров
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"], // Полный набор полифиллов
    }),
  ],
  build: {
    lib: {
      /** Точка входа */
      entry: "src/widget/Survey.ts",
      /** Название */
      name: "PollitectWidget",
      /** Название получаемого файла */
      fileName: () => `pollitect-widget.js`,
      /**
       * Форматы, в которых нужно создавать бандл. Генерируем UMD версию.
       * Это универсальный формат, который работает в разных средах
       */
      formats: ["umd"],
    },
    rollupOptions: {
      /** Зависимости, которые НЕ должны включаться в бандл. Включаем все */
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
