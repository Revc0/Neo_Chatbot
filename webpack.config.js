const path = require('path');

module.exports = {
  entry: './index.js', // Your main entry file
  output: {
    filename: 'bundle.js', // Output bundle file name
    path: path.resolve(__dirname, 'dist') // Output directory
  },
};
