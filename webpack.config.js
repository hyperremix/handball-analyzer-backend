const TerserPlugin = require('terser-webpack-plugin');

module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
  ];

  return {
    ...options,
    target: 'node',
    mode: 'development',
    devtool: 'source-map',
    entry: {
      app: './src/app.ts',
      pdf: './src/pdf/pdf-lambda.ts',
      upload: './src/upload/upload-lambda.ts',
    },
    externals: ['pdf-parse'],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
      },
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: 'tsconfig.build.json',
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /.node$/,
          loader: 'node-loader',
        },
      ],
    },
    output: {
      ...options.output,
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
  };
};
