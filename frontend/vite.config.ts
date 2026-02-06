import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  
  base: '/', // Asegura que las rutas sean correctas
  server: {
    open: true, // Opcional: abre el navegador automáticamente
  },
  build: {
    outDir: 'dist',
  },
})
