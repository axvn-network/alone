import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    // Chạy tests tuần tự để tránh race conditions trên MongoDB mock
    pool: "forks",
    // Exclude files dùng node:test runner (legacy format — chưa migrate sang Vitest)
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/playwright/**",
      "**/vn-lib/__tests__/**",
    ],
    // Chỉ include test files trong src/__tests__/
    include: ["src/__tests__/**/*.test.ts"],
    // Coverage config
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: [
        "src/core/security/**/*.ts",
        "src/core/rbac/**/*.ts",
        "src/modules/capital-transactions/**/*.ts",
        "src/modules/auth/**/*.ts",
        "src/shared/utils/**/*.ts",
      ],
      exclude: ["**/*.d.ts", "**/__tests__/**"],
      // Minimum thresholds
      thresholds: {
        lines: 40,
        functions: 40,
        branches: 30,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/utils": path.resolve(__dirname, "./src/shared/utils"),
      "@/core": path.resolve(__dirname, "./src/core"),
      "@/modules": path.resolve(__dirname, "./src/modules"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
    },
  },
});
