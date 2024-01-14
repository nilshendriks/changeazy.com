import { defineConfig } from "astro/config";
import storyblok from "@storyblok/astro";
import { loadEnv } from "vite";

const env = loadEnv("", process.cwd(), "STORYBLOK");

// https://astro.build/config
export default defineConfig({
    integrations: [
        storyblok({
            accessToken: env.STORYBLOK_TOKEN,
            components: {
                page: "storyblok/Page",
                config: "storyblok/Config",
                feature: "storyblok/Feature",
                grid: "storyblok/Grid",
                teaser: "storyblok/Teaser",
                textblock: "storyblok/TextBlock",
                hero: "storyblok/Hero",
                coaching: "storyblok/Coaching",
                training: "storyblok/Training",
                bodywork: "storyblok/Bodywork",
                about: "storyblok/About",
                testimonials: "storyblok/Testimonials",
                showcase: "storyblok/Showcase",
            },
            apiOptions: {
                region: "eu",
            },
        }),
    ],
});
