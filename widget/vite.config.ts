import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/widget/components"),
      "@services": path.resolve(__dirname, "src/widget/services"),
      "@utils": path.resolve(__dirname, "src/widget/utils"),
      "@widget": path.resolve(__dirname, "src/widget"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [tsconfigPaths()],
  build: {
    target: ["es2015"], // поддержка старых браузеров
    outDir: "dist",
    minify: "terser", // вместо esbuild для лучшей совместимости
    rollupOptions: {
      input: "src/index.ts",
      output: {
        entryFileNames: "pollitect.js",
        format: "iife", // для встраивания в любые страницы
        name: "PollitectWidget", // глобальное имя
      },
    },
    polyfillModulePreload: true, // для старых браузеров
  },
});
