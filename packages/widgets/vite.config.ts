import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), libInjectCss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: "./src/entries/deep-analysis/index.tsx",
      name: "DeepAnalysis",
      fileName: (format) => `chat.${format}.[hash].js`,
      formats: ["umd"],
    },
    sourcemap: true,
    emptyOutDir: true,
    manifest: true,
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "production"
    ),
  },
  server: {
    port: 5173,
    proxy: {
      "/ai-agent": {
        target: "http://localhost:3008",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
