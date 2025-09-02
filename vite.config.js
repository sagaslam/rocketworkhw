import { defineConfig } from 'vite'
import { resolve } from 'path'
import fg from 'fast-glob'
import cssnano from 'cssnano'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig(async ({ command, mode }) => {
  const isProduction = command === 'build'
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
      // Enable minification for production
      minify: 'esbuild', // or 'terser' for more aggressive minification

      // CSS minification is enabled by default in production
      cssMinify: true,

      // Additional build optimizations
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,

      // Rollup options
      rollupOptions: {
        input,
        output: {
          // Optimize chunk splitting
          manualChunks: {
            vendor: ['fast-glob'] // Example: separate vendor chunks
          },
          // Clean file naming for production
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },

    esbuild: {
      // Drop console and debugger in production
      drop: isProduction ? ['console', 'debugger'] : [],

      // Enable minification
      minify: true,

      // Target modern browsers for better optimization
      target: 'es2020'
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

      // Enable CSS minification in production
      postcss: {
        plugins: isProduction
          ? [
              // Add PostCSS plugins for production optimization
              //require('autoprefixer'),
              cssnano({
                preset: 'default'
              })
            ]
          : []
      },

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
      // Sitemap generation
      Sitemap({
        hostname: 'https://hwrocket.works',
        exclude: ['/admin', '/private'], // Pages to exclude from sitemap
        generateRobotsTxt: false, // We'll use our custom robots.txt instead
        outDir: 'dist'
      })
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
