import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js', 
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'], 
      include: [
        'src/funcionalidades/biblioteca.js',
        'src/servicios/serviciolibro.js'
      ], 
      all: true,
      reportsDirectory: './coverage'
    }
  },
})
