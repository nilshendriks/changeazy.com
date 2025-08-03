import { defineConfig } from "astro/config";
import { storyblok } from "@storyblok/astro";
import { loadEnv } from "vite";

const env = loadEnv(import.meta.env.MODE, process.cwd(), "");

// Destructure the actual token
// const { STORYBLOK_DELIVERY_API_TOKEN } = env;
const { STORYBLOK_PREVIEW_API_TOKEN, STORYBLOK_PUBLIC_API_TOKEN } = env;

import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  //output: "server", // needed for live preview
  vite: {
    plugins: [mkcert()],
  },
  integrations: [
    storyblok({
      // accessToken: STORYBLOK_PUBLIC_API_TOKEN,
      accessToken: import.meta.env.DEV
        ? STORYBLOK_PREVIEW_API_TOKEN
        : STORYBLOK_PUBLIC_API_TOKEN,
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
