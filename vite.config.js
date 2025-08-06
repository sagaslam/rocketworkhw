import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Root directory
  root: '.',

  // Public directory for static assets
  publicDir: 'public',

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,

    // Multi-page application configuration
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // Pages from /pages directory
        contact: resolve(__dirname, 'pages/contact.html'),
        joinus: resolve(__dirname, 'pages/joinus.html'),
        partners: resolve(__dirname, 'pages/partners.html'),
        projects: resolve(__dirname, 'pages/projects.html'),
        team: resolve(__dirname, 'pages/team.html')
        // Add more pages as needed
      }
    }
  },

  // Asset handling
  assetsInclude: [
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.woff',
    '**/*.woff2',
    '**/*.ttf',
    '**/*.eot'
  ],

  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // If you're using SCSS/Sass
      scss: {
        additionalData: `
          @import '@styles/libs/_vars.scss';
          @import '@styles/libs/functions';
          @import '@styles/libs/mixins';
          @import '@styles/libs/vendor';
          @import '@styles/libs/breakpoints';
          @import '@styles/libs/html-grid';
          @import '@styles/libs/fixed-grid';
          @import '@styles/fontawesome-all.min.css';
          @import url('https://fonts.googleapis.com/css?family=Merriweather:300,700,300italic,700italic|Source+Sans+Pro:900');
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');    

        `
      }
    }
  },

  // Development server
  server: {
    port: 3000,
    open: true,
    host: true

    // Proxy configuration if needed
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },

  // Preview server (for build testing)
  preview: {
    port: 4173,
    open: true
  },

  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@styles': resolve(__dirname, 'src/assets/styles'),
      '@images': resolve(__dirname, 'src/assets/images'),
      '@data': resolve(__dirname, 'src/data'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@pages': resolve(__dirname, 'pages'),
      '@js': resolve(__dirname, 'src/js')
    }
  },

  // Plugin configuration
  plugins: [
    // Add plugins as needed
    // Example: legacy browser support
    // legacy({
    //   targets: ['defaults', 'not IE 11']
    // })
  ],

  // Environment variables
  envPrefix: 'VITE_',

  // Optimization
  optimizeDeps: {
    include: [
      // Pre-bundle dependencies that should be optimized
    ],
    exclude: [
      // Dependencies to exclude from optimization
    ]
  }
})

/* need to think about for later
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { glob } from 'glob'

// Auto-discover HTML pages
const pages = Object.fromEntries(
  glob.sync('pages/*.html').map(file => [
    file.slice(6, -5), // Remove 'pages/' and '.html'
    resolve(__dirname, file)
  ])
)

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...pages
      }
    }
  }
  // ... rest of config
})*/
