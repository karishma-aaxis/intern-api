import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],

    languageOptions: {
      parser: tseslint.parser,

      parserOptions: {
        project: "./tsconfig.json",
      },

      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-console": "off",
    },
  },

  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "prisma.config.ts",
      "prisma.config.js",
      "prisma.config.d.ts",
      "*.map",
    ],
  },
];