import type { StorybookConfig } from "@storybook/nextjs";

/**
 * Builder Webpack (@storybook/nextjs) et non nextjs-vite :
 * le projet a une config webpack custom (next.config.mjs), non
 * supportée par le builder Vite.
 */
const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.@(ts|tsx|mdx)",
    "../components/**/*.stories.@(ts|tsx|mdx)",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
};

export default config;
