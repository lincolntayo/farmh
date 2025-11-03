/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "light-green": "#C6D6B5",
        "deep-green": "#0B4812",
        "sky-blue": "#1A73E8",
        gray: "#d9d9d9",
        "deep-gray": "#979595"
      },
      fontFamily: {
        poppins: ["Poppins_400Regular"],
        "poppins-medium": ["Poppins_500Medium"],
        "poppins-bold": ["Poppins_700Bold"],
        "poppins-semibold": ["Poppins_600SemiBold"]
      }
    },
  },
  plugins: [],
}

