// babel.config.js
const nativewind = require('nativewind/babel');

module.exports = function (api) {
  api.cache(true);

  const { plugins: nativewindPlugins = [] } = nativewind() ?? {};
  const reanimatedPluginIndex = nativewindPlugins.findIndex(
    (plugin) =>
      plugin === 'react-native-reanimated/plugin' ||
      (Array.isArray(plugin) && plugin[0] === 'react-native-reanimated/plugin'),
  );
  const pluginsWithoutReanimated =
    reanimatedPluginIndex === -1
      ? nativewindPlugins
      : [
          ...nativewindPlugins.slice(0, reanimatedPluginIndex),
          ...nativewindPlugins.slice(reanimatedPluginIndex + 1),
        ];

  return {
    presets: ['babel-preset-expo'],
    plugins: [...pluginsWithoutReanimated, require.resolve('expo-router/babel'), 'react-native-reanimated/plugin'],
  };
};
