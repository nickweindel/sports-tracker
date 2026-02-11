import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";

export default defineConfig([
  js.configs.recommended,
  {
    plugins: { "@typescript-eslint": ts },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
    ignores: ["node_modules/**", "dist/**"],
  },
]);
