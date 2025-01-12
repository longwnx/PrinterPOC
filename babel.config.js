module.exports = {
  presets: ['module:@react-native/babel-preset'],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: './__tests__/',
          assets: './assets/',
          ios: './ios/',
          android: './android/',
          '@components': './src/components',
          '@constants': './src/constants',
          '@context': './src/context',
          '@hoc': './src/hoc',
          '@hooks': './src/hooks',
          '@libs': './src/libs',
          '@modules': './src/modules',
          '@queries': './src/queries',
          '@redux': './src/redux',
          '@screens': './src/screens',
          '@services': './src/services',
          '@styles': './src/styles',
          '@utils': './src/utils',
          '@types': './src/types',
        },
      },
    ],
  ],
};
