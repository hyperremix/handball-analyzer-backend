const config = require('./webpack.config');

module.exports = (options, webpack) => ({
  ...config(options, webpack),
  devtool: undefined,
  mode: 'production',
});
