const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const { DefinePlugin } = require('webpack');

// Common configuration
const commonConfig = (env, argv) => {
  // Determine the mode based on the environment or command line
  const mode = argv.mode || 'development';
  
  return {
    entry: './public/game.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: mode === 'production' ? '[name].[contenthash].js' : '[name].js',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.json'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        minify: mode === 'production' ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : false,
      }),
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new Dotenv({
        systemvars: true,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
  };
};

// Production-specific configuration
const prodConfig = (env, argv) => {
  const mode = argv.mode || 'production';
  
  return {
    mode: mode,
    devtool: 'source-map',
    plugins: [
      ...commonConfig(env, argv).plugins,
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
};

// Development-specific configuration
const devConfig = (env, argv) => {
  const mode = argv.mode || 'development';
  
  return {
    mode: mode,
    devtool: 'eval-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
      hot: true,
      open: true,
      proxy: [
        {
          context: ['/api', '/auth'],
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      ],
    },
  };
};

// Environment-specific configuration
module.exports = (env, argv) => {
  const mode = argv.mode || 'development';
  const isProduction = mode === 'production';
  
  const common = commonConfig(env, argv);
  const specific = isProduction ? prodConfig(env, argv) : devConfig(env, argv);
  
  const config = {
    ...common,
    ...specific,
  };

  // Add environment-specific configurations
  if (isProduction) {
    config.output.publicPath = '/';
  }

  return config;
};