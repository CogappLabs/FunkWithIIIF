import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  if (mode === "gh") {
    return {
      base: "/funk-with-iiif/",
    };
  } else {
    return {};
  }
});
