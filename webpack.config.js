const path = require('path');

module.exports = {
  entry: './src/index.tsx', // Entry point for your application
  output: {
    path: __dirname, // Output directory
    filename: 'bundle.js', // Output file name
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Resolvable extensions
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // File types to transpile
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use Babel for transpilation
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Specify your public directory path
    },
  },
};
