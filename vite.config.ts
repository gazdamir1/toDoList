/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: "assets/js/[name].js",
        assetFileNames: "assets/css/[name].[ext]",
      },
    },
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    coverage: {
      exclude: [
        "src/main.tsx",
        "src/setupTests.ts",
        "**/*.config.*s",
        "**/*.d.ts",
      ],
    },
  },
})
