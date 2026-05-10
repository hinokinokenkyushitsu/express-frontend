/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // 品牌橙黄色（快递行业常用）
        brand: {
          50:  '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc171',
          400: '#ff9f3a',
          500: '#ff8514',  // 主色
          600: '#f06a0a',
          700: '#c7510b',
          800: '#9d4011',
          900: '#7e3612'
        }
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
