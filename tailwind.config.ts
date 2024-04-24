import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  // theme: {
  //   extend: {
  //     colors: {
  //       primary: { "50": "#ecfdf5", "100": "#d1fae5", "200": "#a7f3d0", "300": "#6ee7b7", "400": "#34d399", "500": "#10b981", "600": "#059669", "700": "#047857", "800": "#065f46", "900": "#064e3b", "950": "#022c22" }
  //     }
  //   },
  //   fontFamily: {
  //     'body': [
  //       'Inter',
  //       'ui-sans-serif',
  //       'system-ui',
  //       '-apple-system',
  //       'system-ui',
  //       'Segoe UI',
  //       'Roboto',
  //       'Helvetica Neue',
  //       'Arial',
  //       'Noto Sans',
  //       'sans-serif',
  //       'Apple Color Emoji',
  //       'Segoe UI Emoji',
  //       'Segoe UI Symbol',
  //       'Noto Color Emoji'
  //     ],
  //     'sans': [
  //       'Inter',
  //       'ui-sans-serif',
  //       'system-ui',
  //       '-apple-system',
  //       'system-ui',
  //       'Segoe UI',
  //       'Roboto',
  //       'Helvetica Neue',
  //       'Arial',
  //       'Noto Sans',
  //       'sans-serif',
  //       'Apple Color Emoji',
  //       'Segoe UI Emoji',
  //       'Segoe UI Symbol',
  //       'Noto Color Emoji'
  //     ]
  //   }
  // },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            focus: '#00295f',
            primary: {
              foreground: "#ffffff",
              DEFAULT: "#00295f",
              "50": "#99a9bf", 
              "100": "#8094af", 
              "200": "#667f9f", 
              "300": "#4d698f", 
              "400": "#33547f", 
              "500": "#1a3e6f", 
              "600": "#00295f", 
              "700": "#002556", 
              "800": "#00214c", 
              "900": "#001d43", 
              "950": "#001939"
            }
          },
        },
      },
    })
  ],
};
export default config;
