/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */

import colors from "tailwindcss/colors"

export default {
  dark: "class",
  mode: "jit",
  corePlugins: {
    float: false,
    clear: false,
    transitionDelay: false,
    skew: false,
  },
  theme: {
    // container: {
    //   center: true,
    // },
    extend: {
      colors: {
        bgColor: "var(--bg-color)",
        bgLightColor: "var(--bg-light-color)",
        bgDarkColor: "var(--bg-dark-color)",
        fgColor: "var(--fg-color)",
        fgLightColor: "var(--fg-light-color)",
        brdColor: "var(--brd-color)",
        errColor: "var(--err-color)",
        acColor: "var(--ac-color)",
        actColor: "var(--act-color)",
        ttColor: "var(--tt-color)",
        blue: colors.blue,
        green: colors.green,
        teal: colors.teal,
        indigo: colors.indigo,
        purple: colors.purple,
        orange: colors.orange,
        pink: colors.pink,
        red: colors.red,
        yellow: colors.yellow,
      },
    },
    fontFamily: {
      sans: "var(--font-sans)",
      mono: "var(--font-mono)",
      icon: "var(--font-icon)",
    },
  },
  variants: {},
  plugins: [],
  purge: [
    "components/**/*.vue",
    "layouts/**/*.vue",
    "pages/**/*.vue",
    "plugins/**/*.js",
    "nuxt.config.js",
  ],
}
