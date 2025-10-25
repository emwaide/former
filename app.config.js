const tailwindConfig = require('./tailwind.config.js');

const colors = tailwindConfig.theme?.extend?.colors ?? {};
const surfaceColor = colors.surface ?? colors.background;

if (!surfaceColor) {
  throw new Error('Expected a surface color in tailwind.config.js');
}

/** @type {import('@expo/config-types').ExpoConfig} */
const config = {
  expo: {
    name: 'pebble',
    slug: 'pebble',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'pebble',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: surfaceColor,
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: surfaceColor,
        },
      ],
      'expo-font',
      'expo-sqlite',
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};

module.exports = config;
