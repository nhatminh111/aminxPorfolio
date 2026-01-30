import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation-vendor': ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Tối ưu hóa assets
    assetsInlineLimit: 4096, // Inline assets nhỏ hơn 4KB
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@react-three/drei', '@react-three/fiber'], // Exclude để load riêng
  },
  // Tối ưu hóa server
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})
