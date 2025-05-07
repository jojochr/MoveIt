module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      // Make sql-files importable
      ['inline-import', { extensions: ['.sql'] }],
    ],
  };
};
