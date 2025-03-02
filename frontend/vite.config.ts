import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@styles": "src/assets/styles",
      "@components": "src/components",
      "@pages": "src/pages",
      "@store": "src/store",
      "@utils": "src/utils",
      "@ui": "src/ui",
      "@": "src",
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  server: {
    port: 7123,
    host: "localhost",
  },
  build: {
    outDir: "build",
    assetsDir: "public",
    cssCodeSplit: false,
  },
});
