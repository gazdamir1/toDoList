/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
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
