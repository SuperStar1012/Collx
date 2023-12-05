module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      {
        useTransformReactJSXExperimental: true,
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
    'react-native-reanimated/plugin',
    'relay',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@assets': './src/assets',
          '@actions': './src/actions',
          '@components': './src/components',
          '@globals': './src/globals',
          '@hooks': './src/hooks',
          '@mutations': './src/mutations',
          '@navigations': './src/navigations',
          '@pages': './src/pages',
          '@providers': './src/providers',
          '@relay': './src/relay',
          '@services': './src/services',
          '@theme': './src/theme',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
