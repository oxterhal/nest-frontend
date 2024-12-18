module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "custom-dark": "#191a1a",
      },
      backgroundImage: {
        "custom-grid": `
          linear-gradient(0deg, 
            transparent 24%, 
            rgba(114, 114, 114, 0.3) 25%, 
            rgba(114, 114, 114, 0.3) 26%, 
            transparent 27%, 
            transparent 74%, 
            rgba(114, 114, 114, 0.3) 75%, 
            rgba(114, 114, 114, 0.3) 76%, 
            transparent 77%, 
            transparent
          ),
          linear-gradient(90deg, 
            transparent 24%, 
            rgba(114, 114, 114, 0.3) 25%, 
            rgba(114, 114, 114, 0.3) 26%, 
            transparent 27%, 
            transparent 74%, 
            rgba(114, 114, 114, 0.3) 75%, 
            rgba(114, 114, 114, 0.3) 76%, 
            transparent 77%, 
            transparent
          )
        `,
      },
      backgroundSize: {
        "custom-size": "55px 55px",
      },
    },
  },
  plugins: [],
};
