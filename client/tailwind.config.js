/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      colors:{
        buttonColor:'#213B53',
        customBlue: {
          DEFAULT: '#6480A3', // Equivalent to rgb(100,128,163)
          darker: '#213B53', // Equivalent to rgba(33,59,83,1)
          darkest: '#0A2437', // Equivalent to rgba(10,36,55,1)
        },
        gradientBlue: {
          '0': '90deg',
          '35': '35%',
          '100': '100%',
        },
      },
      backgroundImage: (theme) => ({
        'custom-gradient-blue': `linear-gradient(${theme('colors.gradientBlue.0')}, ${theme('colors.customBlue.DEFAULT')} 0%, ${theme('colors.customBlue.darker')} ${theme('colors.gradientBlue.35')}, ${theme('colors.customBlue.darkest')} ${theme('colors.gradientBlue.100')})`,
      }),


      
    
    },
  },
  plugins: [],
}