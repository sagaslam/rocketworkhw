import { defineConfig } from 'vite'
import { resolve } from 'path'
import fg from 'fast-glob'

export default defineConfig(async () => {
  const files = await fg(['*.html', 'pages/**/*.html'], { cwd: __dirname })

  // Build Rollup input
  const input = Object.fromEntries(
    files.map((file) => {
      // Keep root HTML files at root, pages/* stay in pages/
      const key = file.replace(/\.html$/, '')
      return [key, resolve(__dirname, file)]
    })
  )

  return {
    build: {
      rollupOptions: {
        input
      }
    },

    // Root directory
    root: '.',

    // Public directory for static assets
    publicDir: 'public',

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
          @import '@styles/libs/_functions';
          @import '@styles/libs/_mixins';
          @import '@styles/libs/_vendor';
          @import '@styles/libs/_breakpoints';
          @import '@styles/libs/_html-grid';
          @import '@styles/libs/_fixed-grid';
          @import '@styles/fontawesome-all.min.css';
          @import url('https://fonts.googleapis.com/css?family=Merriweather:300,700,300italic,700italic|Source+Sans+Pro:900');
          @import url('https://fonts.googleapis.com/css2?family=Michroma&display=auto');

        `,

          api: 'modern-compiler',

          includePaths: ['src/assets/styles'],

          // Option 4: Silence deprecation warnings
          silenceDeprecations: ['legacy-js-api']
        }
      }
    },

    // Development server
    server: {
      port: 3000,
      open: true,
      host: true
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
  }
})
