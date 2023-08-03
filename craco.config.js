
const Path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': Path.resolve(__dirname, 'src'),
    },
  },
};
