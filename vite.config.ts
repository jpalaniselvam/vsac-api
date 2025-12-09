import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      // Entry point for your library
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'lib/node/fileCache': resolve(__dirname, 'src/lib/node/fileCache.ts')
      },
      // Output formats
      formats: ['es'],
      // Output file name
      fileName: (_, entryName) => `${entryName}.js`
    },
    outDir: 'dist',
    sourcemap: true,
    // Externalize dependencies to avoid bundling them
    rollupOptions: {
      external: [
        // Node built-ins
        /^node:/,
        'fs',
        'path',
        'url',
        'process',
        'http',
        'https',
        'stream',
        'util',
        'events',
        'buffer',
        'querystring',
        // Package dependencies
        'fast-xml-parser'
      ],
      output: {
        // Preserve module structure
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js'
      }
    },
    // Target Node.js environment
    target: 'esnext',
    minify: false
  },
  plugins: [
    // Generate TypeScript declaration files
    dts({
      include: ['src/**/*'],
      outDir: 'dist',
      insertTypesEntry: true
    })
  ],
  test: {
    // Test environment
    environment: 'node',

    // Global test timeout (30 seconds for E2E tests)
    testTimeout: 30000,

    // Hook timeout
    hookTimeout: 30000,

    // Include test files
    include: ['e2e/**/*.test.ts', 'tests/**/*.test.ts'],

    // Exclude patterns
    exclude: ['node_modules', 'dist', '.git', '.cache'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'e2e/', '**/*.test.ts', '**/*.config.ts']
    },

    // Reporter configuration
    reporters: ['verbose'],

    // Globals
    globals: true,

    // Setup files
    setupFiles: ['./vitest.setup.ts']
  }
});
