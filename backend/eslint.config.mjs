import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    {
        languageOptions: {
            parserOptions: {                                        
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
                projectService: true,
                allowDefaultProject: true,
            },
        },
        rules: {
            "@typescript-eslint/no-extraneous-class": "off",
            // You can add more later, like:
            // "@typescript-eslint/no-explicit-any": "warn",
            // "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
        },
    },
    {
        ignores: ["dist/**", "node_modules/**", "eslint.config.mjs"]
    }
]);
