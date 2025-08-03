import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import netlify from "@astrojs/netlify";
import { storyblok } from "@storyblok/astro";
import mkcert from "vite-plugin-mkcert";

const env = loadEnv(process.env.NODE_ENV, process.cwd(), "VITE_");

const isLocal = import.meta.env.VITE_APP_ENV === "local";
const isPreview = import.meta.env.VITE_APP_ENV === "preview";
const isProd = import.meta.env.VITE_APP_ENV === "production";

export default defineConfig({
  output: isPreview || isProd ? "server" : "static",
  adapter: isPreview || isProd ? netlify() : undefined,
  vite: {
    plugins: [mkcert()],
  },
  integrations: [
    storyblok({
      accessToken: isPreview
        ? env.VITE_STORYBLOK_PREVIEW_API_TOKEN
        : env.VITE_STORYBLOK_PUBLIC_API_TOKEN,
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
