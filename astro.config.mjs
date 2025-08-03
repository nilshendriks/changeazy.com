import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import netlify from "@astrojs/netlify";
import { storyblok } from "@storyblok/astro";
import mkcert from "vite-plugin-mkcert";

const env = loadEnv(process.env.NODE_ENV, process.cwd(), "VITE_");

const isDev = import.meta.env.MODE === "development";
const isPreview = import.meta.env.VITE_ENVIRONMENT === "preview";

export default defineConfig({
  output: isPreview ? "server" : "static",
  adapter: !isDev && isPreview ? netlify() : undefined,
  vite: {
    plugins: [mkcert()],
  },
  integrations: [
    storyblok({
      accessToken: env.VITE_STORYBLOK_PREVIEW_API_TOKEN,
      apiOptions: {
        region: "eu", // or 'us'
      },
      components: {
        section_centered: "storyblok/SectionCentered",
        page: "storyblok/Page",
        config: "storyblok/Config",
        feature: "storyblok/Feature",
        grid: "storyblok/Grid",
        teaser: "storyblok/Teaser",
        textblock: "storyblok/TextBlock",
        hero: "storyblok/Hero",
        hero_block: "storyblok/HeroBlock",
        coaching: "storyblok/Coaching",
        training: "storyblok/Training",
        bodywork: "storyblok/Bodywork",
        about: "storyblok/About",
        testimonials: "storyblok/Testimonials",
        showcase: "storyblok/Showcase",
        simple_section: "storyblok/SimpleSection",
        button: "storyblok/Button",
      },
      // livePreview: true, // optional but recommended
    }),
  ],
});
