import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/trend': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: () => '/v1/datalab/search',
      },
      '/api/search': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: (path) => '/v1/search/local.json' + path.replace('/api/search', ''),
      },
      '/api/place': {
        target: 'https://map.naver.com',
        changeOrigin: true,
        rewrite: (path) => '/v5/api/place' + path.replace('/api/place', ''),
      },
      '/api/foods': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: () => '/macros/s/AKfycbw_j2hrG9W6UYc8oAvZmde63zPRI4q73qognvCz-vuPy1rppx1IJh8CT9Y3R_YxuCV9/exec',
      },
    },
  },
})
