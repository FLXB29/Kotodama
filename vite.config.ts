import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('@tanstack/react-query')) return 'query-vendor'
          if (id.includes('react-hook-form')) return 'form-vendor'
          if (id.includes('axios')) return 'api-vendor'
          if (id.includes('react-router')) return 'router-vendor'
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('scheduler'))
            return 'react-vendor'
          return 'vendor'
        },
      },
    },
  },
  test: {
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: [
        'src/features/auth/permissions.ts',
        'src/features/dictionary/DictionaryPage.tsx',
        'src/features/srs/ReviewPage.tsx',
        'src/features/video/VideoLearningPage.tsx',
        'src/features/learning/CoursesPage.tsx',
        'src/lib/apiClient.ts',
      ],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
      },
    },
  },
  server: {
    proxy: {
      // Development-only adapter. The Spring Boot API must expose this same
      // endpoint in production, keeping the browser independent of Jisho/CORS.
      '/api/v1/dictionary/search': {
        target: 'https://jisho.org',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/v1/dictionary/search', '/api/v1/search/words'),
      },
      // Keep browser cookies on the Vite origin during local development.
      // This lets the CSRF and refresh-token cookies work after a page reload.
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
})
