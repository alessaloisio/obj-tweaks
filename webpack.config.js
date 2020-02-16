const path = require('path');

let config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
};

module.exports = config;
