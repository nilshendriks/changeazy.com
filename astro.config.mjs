import { defineConfig } from 'astro/config'
import storyblok from '@storyblok/astro'
import { loadEnv } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import netlify from '@astrojs/netlify';
const env = loadEnv("", process.cwd(), 'STORYBLOK')

export default defineConfig({
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      bridge: env.STORYBLOK_IS_PREVIEW === 'yes',
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
      apiOptions: {
        region: 'eu',
      },
    }),
  ],
  output: env.STORYBLOK_IS_PREVIEW === 'yes' ? 'server' : 'static',
  // ...(env.STORYBLOK_ENV === 'development' && {
  //   vite: {
  //     plugins: [basicSsl()],
  //     server: {
  //       https: true
  //     }
  //   }
  // }),
  adapter: netlify(),
  vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
  },
})