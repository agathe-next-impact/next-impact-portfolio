import type { Preview } from "@storybook/nextjs";
import "../app/globals.css";

/**
 * Les variables de police (--font-serif / --font-sans / --font-mono) sont
 * injectées par next/font dans le layout de l'app ; en isolation Storybook
 * elles retombent sur les fallbacks définis dans tailwind.config.ts
 * (Georgia / Arial / monospace). Les tokens de couleur (--paper, --ink,
 * --rule, --accent-color) viennent de globals.css et s'affichent fidèlement.
 */
const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "paper",
      values: [
        { name: "paper", value: "#ffffff" },
        { name: "paper-2", value: "#ebe9e3" },
        { name: "ink", value: "#0e0e0c" },
      ],
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
