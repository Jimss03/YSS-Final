/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure Tailwind scans all your files
  ],
  theme: {
    extend: { 

      animation: {
        marquee: "marquee 10s linear infinite",
      },
      
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },


      fontFamily: {
        
      cousine: ['Cousine', 'monospace','poppins',], // Define 'Cousine' as a custom font
      },
    },
  },
  plugins: [],
};

