module.exports = {
  plugins: ['@babel/plugin-proposal-class-properties', 'lodash'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  retainLines: true,
};
