import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@styles": "/src/assets/styles",
      "@components": "/src/components",
      "@layout": "/src/layout",
      "@pages": "/src/pages",
      "@hooks": "/src/hooks",
      "@store": "/src/store",
      "@utils": "/src/utils",
      "@api": "/src/api",
      "@ui": "/src/ui",
      "@": "/src",
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
