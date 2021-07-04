require("dotenv").config()

// Common options
export const options = {
  name: "Hoppscotch",
  shortDescription: "Open source API development ecosystem",
  description:
    "Helps you create requests faster, saving precious time on development.",
  loading: {
    color: "var(--accent-color)",
    background: "var(--primary-color)",
  },
  app: {
    background: "#202124",
  },
  social: {
    twitter: "@hoppscotch_io",
  },
}

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: "static",

  // Default: localhost
  server: {
    host: "0.0.0.0",
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    meta: [
      {
        name: "keywords",
        content:
          "hoppscotch, hopp scotch, hoppscotch online, hoppscotch app, postwoman, postwoman chrome, postwoman online, postwoman for mac, postwoman app, postwoman for windows, postwoman google chrome, postwoman chrome app, get postwoman, postwoman web, postwoman android, postwoman app for chrome, postwoman mobile app, postwoman web app, api, request, testing, tool, rest, websocket, sse, graphql, socketio",
      },
      {
        name: "X-UA-Compatible",
        content: "IE=edge, chrome=1",
      },
      {
        itemprop: "name",
        content: `${options.name} • ${options.shortDescription}`,
      },
      {
        itemprop: "description",
        content: options.description,
      },
      {
        itemprop: "image",
        content: `${process.env.BASE_URL}/banner.jpg`,
      },
      // Add to homescreen for Chrome on Android. Fallback for PWA (handled by nuxt)
      {
        name: "application-name",
        content: options.name,
      },
      // Windows phone tile icon
      {
        name: "msapplication-TileImage",
        content: `/icon.png`,
      },
      {
        name: "msapplication-TileColor",
        content: options.app.background,
      },
      {
        name: "msapplication-tap-highlight",
        content: "no",
      },
    ],
  },

  // Customize the progress-bar color (https://nuxtjs.org/api/configuration-loading/#customizing-the-progress-bar)
  loading: {
    color: options.loading.color,
    continuous: true,
  },

  // Customize the loading indicator (https://nuxtjs.org/api/configuration-loading-indicator)
  loadingIndicator: {
    name: "pulse",
    color: options.loading.color,
    background: options.loading.background,
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["~/assets/scss/styles.scss", "~/assets/scss/themes.scss"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    "~/plugins/v-tippy",
    "~/plugins/vuex-persist",
    "~/plugins/vue-rx",
    "~/plugins/vue-apollo",
    { src: "~/plugins/web-worker", ssr: false },
    "~/plugins/formatCountry.js",
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://github.com/nuxt-community/pwa-module
    "@nuxtjs/pwa",
    // https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module",
    // https://github.com/nuxt-community/stylelint-module
    "@nuxtjs/stylelint-module",
    // https://github.com/nuxt-community/analytics-module
    "@nuxtjs/google-analytics",
    // https://github.com/nuxt-community/gtm-module
    "@nuxtjs/gtm",
    // https://github.com/windicss/windicss
    "nuxt-windicss",
    // https://github.com/nuxt-community/color-mode-module
    "@nuxtjs/color-mode",
    // https://github.com/nuxt-community/svg-module
    "@nuxtjs/svg",
    // https: //github.com/nuxt-community/google-fonts-module
    "@nuxtjs/google-fonts",
    // https://github.com/nuxt/typescript
    "@nuxt/typescript-build",
    // https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://github.com/nuxt-community/axios-module
    "@nuxtjs/axios",
    // https://github.com/nuxt-community/modules/tree/master/packages/toast
    "@nuxtjs/toast",
    // https://github.com/nuxt-community/i18n-module
    "nuxt-i18n",
    // https://github.com/nuxt-community/robots-module
    "@nuxtjs/robots",
    // https://github.com/nuxt-community/sitemap-module
    "@nuxtjs/sitemap",
  ],

  // PWA module configuration (https://pwa.nuxtjs.org/setup)
  pwa: {
    meta: {
      name: `${options.name} - ${options.shortDescription}`,
      description: options.description,
      ogHost: process.env.BASE_URL,
      ogImage: `${process.env.BASE_URL}/banner.jpg`,
      twitterCard: "summary_large_image",
      twitterSite: options.social.twitter,
      twitterCreator: options.social.twitter,
      theme_color: options.app.background,
    },
    manifest: {
      name: options.name,
      short_name: options.name,
      description: options.shortDescription,
      start_url: "/?source=pwa",
      background_color: options.app.background,
    },
  },

  // ESLint module configuration (https://github.com/nuxt-community/eslint-module)
  eslint: {
    fix: true,
    emitWarning: true,
    quiet: true,
  },

  // Toast module configuration (https://github.com/nuxt-community/modules/tree/master/packages/toast)
  toast: {
    position: "bottom-center",
    duration: 3000,
    theme: "bubble",
    keepOnHover: true,
  },

  // Google Analytics module configuration (https://github.com/nuxt-community/analytics-module)
  googleAnalytics: {
    id: process.env.GA_ID,
  },

  // Google Tag Manager module configuration (https://github.com/nuxt-community/gtm-module)
  gtm: {
    id: process.env.GTM_ID,
  },

  // Sitemap module configuration (https://github.com/nuxt-community/sitemap-module)
  sitemap: {
    hostname: process.env.BASE_URL || "https://hoppscotch.io",
  },

  // Robots module configuration (https://github.com/nuxt-community/robots-module)
  robots: {
    UserAgent: "*",
    Disallow: "",
    Allow: "/",
    Sitemap: `${process.env.BASE_URL}/sitemap.xml`,
  },

  // Google Fonts module configuration (https://github.com/nuxt-community/google-fonts-module)
  googleFonts: {
    display: "swap",
    families: {
      "Material+Icons": true,
      Montserrat: [400, 500, 600, 700, 800],
      "Roboto+Mono": true,
    },
  },

  // i18n module configuration (https://github.com/nuxt-community/i18n-module)
  i18n: {
    locales: [
      {
        code: "en",
        name: "English",
        iso: "en-US",
        file: "en-US.json",
        country: "US",
      },
      {
        code: "es",
        name: "Español",
        iso: "es-ES",
        file: "es-ES.json",
        country: "ES",
      },
      {
        code: "fr",
        name: "Français",
        iso: "fr-FR",
        file: "fr-FR.json",
        country: "FR",
      },
      {
        code: "fa",
        name: "Farsi",
        iso: "fa-IR",
        file: "fa-IR.json",
        country: "IR",
      },
      {
        code: "pt",
        name: "Português",
        iso: "pt-PT",
        file: "pt-PT.json",
        country: "PT",
      },
      {
        code: "pt-br",
        name: "Português Brasileiro",
        iso: "pt-BR",
        file: "pt-BR.json",
        country: "BR",
      },
      {
        code: "cn",
        name: "简体中文",
        iso: "zh-CN",
        file: "zh-CN.json",
        country: "CN",
      },
      {
        code: "tw",
        name: "繁體中文",
        iso: "zh-TW",
        file: "zh-TW.json",
        country: "TW",
      },
      {
        code: "id",
        name: "Bahasa Indonesia",
        iso: "id-ID",
        file: "id-ID.json",
        country: "ID",
      },
      {
        code: "tr",
        name: "Türkçe",
        iso: "tr-TR",
        file: "tr-TR.json",
        country: "TR",
      },
      {
        code: "de",
        name: "Deutsch",
        iso: "de-DE",
        file: "de-DE.json",
        country: "DE",
      },
      {
        code: "ja",
        name: "日本語",
        iso: "ja-JP",
        file: "ja-JP.json",
        country: "JP",
      },
      {
        code: "ko",
        name: "한국어",
        iso: "ko-KR",
        file: "ko-KR.json",
        country: "KR",
      },
      {
        code: "in",
        name: "हिंदी",
        iso: "in-IN",
        file: "in-IN.json",
        country: "IN",
      },
      {
        code: "bn",
        name: "Bengali",
        iso: "bn-BD",
        file: "bn-BD.json",
        country: "BD",
      },
      {
        code: "ml",
        name: "മലയാളം",
        iso: "ml-ML",
        file: "ml-ML.json",
        country: "ML",
      },
      {
        code: "vi",
        name: "Vietnamese",
        iso: "vi-VN",
        file: "vi-VN.json",
        country: "VN",
      },
      {
        code: "nl",
        name: "Dutch",
        iso: "nl-BE",
        file: "nl-BE.json",
        country: "BE",
      },
      {
        code: "nb",
        name: "Norwegian (Bokmål)",
        iso: "nb-NO",
        file: "nb-NO.json",
        country: "NO",
      },
    ],
    defaultLocale: "en",
    vueI18n: {
      fallbackLocale: "en",
    },
    lazy: true,
    langDir: "lang/",
    detectBrowserLanguage: {
      alwaysRedirect: true,
      fallbackLocale: "en",
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ["three"],
    // You can extend webpack config here
    extend(config, { isDev, isClient }) {
      // Sets webpack's mode to development if `isDev` is true.
      if (isDev) {
        config.mode = "development"
      }

      config.node = {
        fs: "empty",
      }

      if (isClient) {
        config.module.rules.unshift({
          test: /\.worker\.(c|m)?js$/i,
          use: { loader: "worker-loader" },
          exclude: /(node_modules)/,
        })

        config.module.rules.push({
          test: /\.md$/i,
          use: { loader: "raw-loader" },
          exclude: /(node_modules)/,
        })

        config.module.rules.push({
          test: /\.geojson$/i,
          use: { loader: "json-loader" },
          exclude: /(node_modules)/,
        })

        config.module.rules.push({
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        })

        config.module.rules.push({
          test: /\.js$/,
          include: /(node_modules)/,
          exclude: /(node_modules)\/(ace-builds)|(@firebase)/,
          loader: "babel-loader",
          options: {
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-nullish-coalescing-operator",
              "@babel/plugin-proposal-optional-chaining",
            ],
          },
        })
      }
    },
    parallel: true,
    cache: true,
    // hardSource: true,
  },

  // Generate configuration (https://nuxtjs.org/api/configuration-generate)
  generate: {
    fallback: true,
  },

  // dotenv configuration (https://github.com/nuxt-community/dotenv-module)
  env: {
    GA_ID: process.env.GA_ID,
    GTM_ID: process.env.GTM_ID,
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    PROJECT_ID: process.env.PROJECT_ID,
    STORAGE_BUCKET: process.env.STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
    APP_ID: process.env.APP_ID,
    MEASUREMENT_ID: process.env.MEASUREMENT_ID,
    BASE_URL: process.env.BASE_URL,
  },

  // Router configuration (https://nuxtjs.org/api/configuration-router)
  router: {
    linkExactActiveClass: "text-accent",
  },
}
