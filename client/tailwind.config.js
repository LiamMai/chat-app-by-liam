/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'banner-login-1': "url('../assets/images/loginBanner1.png')",
        'banner-login-2': "url('../assets/images/loginBanner2.png')",
        'banner-login-3': "url('../assets/images/loginBanner3.png')",
        'banner-login-4': "url('../assets/images/loginBanner4.png')",
        'home-phone': "url('../assets/images/home-phones.png')",
        'logo': "url('../assets/images/instagram-logo-illustration.png')",
        'logo-face': "url('../assets/images/facebook-logo.png')"
      },
      backgroundColor: {
        'ig-secondary-background': 'rgb(250, 250, 250)',
        'ig-primary-button': 'rgb(0, 149, 246)',
        'ig-separator': 'rgb(219, 219, 219)',
        'ig-primary-button-hover': 'rgb(24, 119, 242)'
      },
      borderColor: {
        'ig-stroke': 'rgb(219, 219, 219)'
      },
      height: {
        'login-banner': '581.15px'
      },
      width: {
        'layout-auth': '1050px'
      },
      colors: {
        'ig-secondary-text': 'rgb(115, 115, 115)'
      },
      fontSize: {
        md: ['17px', '20px'],
      }
    },
  },
  plugins: [],
}
