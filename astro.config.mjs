import { defineConfig } from 'astro/config'
import storyblok from '@storyblok/astro'
// import netlify  from  "@astrojs/netlify/functions";
import { loadEnv } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
const env = loadEnv("", process.cwd(), 'STORYBLOK')

export default defineConfig({
  // output:  import.meta.env.VITE_ENVIRONMENT  ===  "preview"  ?  "server"  :  "static",
  // adapter: netlify(),
  // adapter: import.meta.env.VITE_ENVIRONMENT === 'preview' ? netlify() : undefined,
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      /* accessToken:
        import.meta.env.VITE_ENVIRONMENT  ===  "preview"
          ?  env.STORYBLOK_TOKEN : env.STORYBLOK_TOKEN_PUBLISHED, */
      // bridge:  import.meta.env.VITE_ENVIRONMENT  ===  "preview"  ? true :  false,
      components: {
        page: 'storyblok/Page',
        config: 'storyblok/Config',
        feature: 'storyblok/Feature',
        grid: 'storyblok/Grid',
        teaser: 'storyblok/Teaser',
        textblock: 'storyblok/TextBlock',
        hero: 'storyblok/Hero',
        coaching: 'storyblok/Coaching',
        training: 'storyblok/Training',
        bodywork: 'storyblok/Bodywork',
        about: 'storyblok/About',
        testimonials: 'storyblok/Testimonials',
        showcase: 'storyblok/Showcase',
      },
    }),
  ],
  vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
  },
})