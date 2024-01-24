const BASE_URL = process.env.BASE_URL;

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  devtools: { enabled: true },

  app: {
    head: {
      title: 'WeRoad',
      htmlAttrs: {
        lang: 'en',
        class: 'h-full bg-gray-50',
      },
      bodyAttrs: {
        class: 'h-full',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  modules: [
    '@nuxtjs/apollo',
    '@nuxt-alt/auth',
    '@nuxtjs/tailwindcss',
    'nuxt-typed-router',
  ],

  vite: {
    optimizeDeps: {
      exclude: ['react'],
    },
  },

  apollo: {
    clients: {
      default: {
        httpEndpoint: `${BASE_URL}/graphql`,
      },
    },
    defaultOptions: {
      query: {
        fetchPolicy: 'cache-first',
      },
    },
  },

  auth: {
    globalMiddleware: true,
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access_token',
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        },
        user: {
          property: false,
        },
        endpoints: {
          login: { url: `${BASE_URL}/auth/login`, method: 'post' },
          refresh: { url: `${BASE_URL}/auth/refresh`, method: 'post' },
          user: { url: `${BASE_URL}/auth/user`, method: 'get' },
          logout: { url: `${BASE_URL}/auth/logout`, method: 'post' },
        },
      },
    },
  },

  googleFonts: {
    families: {
      Inter: true,
    },
  },
});
