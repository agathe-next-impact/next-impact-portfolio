import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Extension .mts volontaire : le package.json du repo est en CommonJS, et un
// vitest.config.ts en syntaxe ESM y déclenche un avertissement de Vite.

// Les tests couvrent le code Sentinelle uniquement. Le site vitrine n'a pas de
// suite de tests : ne pas élargir `include` sans décision explicite, sinon
// `npm test` devient vert-mais-vide et cesse de vouloir dire quelque chose.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/sentinelle/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@sentinelle": fileURLToPath(new URL("./src/sentinelle", import.meta.url)),
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
