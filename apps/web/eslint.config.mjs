import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig } from "eslint/config";
import eslintignore from "./.eslintignore.mjs";

const eslintConfig = defineConfig([
   ...nextVitals,
   ...nextTs,
   eslintignore,
]);

export default eslintConfig;
