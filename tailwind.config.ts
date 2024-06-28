import daisyui from "daisyui";

export default {
  plugins: [daisyui],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: {
      center: true,
      screens: {
        sm: "1270px",
        md: "1270px",
        lg: "1270px",
        xl: "1270px",
        "2xl": "1270px",
      },
    },
    extend: {
      animation: {
        sliding: "sliding 30s linear infinite",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      fontFamily: {
        "roboto": "Roboto, sans-serif",
        "titillium": "Titillium Web, sans-serif",
      },
      colors: {
        primary: "#005143",
        primaryContent: "#005143",
        secondary: "#920110",
        warning: "#39393A",
        white: "#FFFFFF",
        gray: "#929292",
        lightGray: "#9B9595",
        darkGray: "#727272",
        graphite: "#353535",
      },
      fontSize: {
        15: "15px",
      },
      width: {
        "45": "180px",
        "9/10": "90%",
      },
      maxWidth: {
        "45": "180px",
        "2/4xl": "720px",
        "screen-3xl": "1920px",
      },
      minWidth: {
        "45": "180px",
        "2/4xl": "720px",
      },
      boxShadow: {
        'minicart': '0 0 12px rgba(0, 0, 0, 0.07)',
      },
      backgroundImage: {
        "bag-arrow": "url('/image/bag-arrow-right.webp)"
      }
    },
  },
};
