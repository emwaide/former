import type { KnipConfig } from 'knip';

export default {
    entry: ['app/**/*.tsx', 'App.tsx', 'index.ts', 'index.js'],
    project: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'utils/**/*.{ts,tsx}',
        'types/**/*.{ts,tsx}'
    ],
    ignore: [
        'app/**/_layout.tsx',
        'app/**/+not-found.tsx',
        'app/**/_sitemap.ts',
        '**/*.d.ts',
        '**/*.stories.*',
        '**/*.spec.*',
        '**/*.test.*',
        'scripts/**'
    ]
} satisfies KnipConfig;
