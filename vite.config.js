import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const config = {};

  // Conditional configuration for GitHub Pages
  if (mode === "github") {
    config.base = "/funk-with-iiif/";
  }

  return config;
});
