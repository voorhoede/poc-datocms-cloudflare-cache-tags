import { defineConfig, envField } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  adapter: cloudflare(),
  env: {
    schema: {
      DATOCMS_READONLY_API_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  output: "static",
});
