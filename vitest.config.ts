import { defineConfig } from 'vitest/config';

export default defineConfig({
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
        exclude: [
            'node_modules',
            'dist',
            '.git',
            '.cache'
        ],

        // Coverage configuration
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                'e2e/',
                '**/*.test.ts',
                '**/*.config.ts'
            ]
        },

        // Reporter configuration
        reporters: ['verbose'],

        // Globals
        globals: true,

        // Setup files
        setupFiles: ['./vitest.setup.ts']
    }
});
