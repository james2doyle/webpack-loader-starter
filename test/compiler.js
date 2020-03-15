const webpack = require('webpack');
const { resolve } = require('path');
const MemoryFS = require('memory-fs');

module.exports = function (fixture, options = {}) {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [{
        test: /\.txt$/,
        use: {
          loader: resolve(__dirname, '../src/loader.js'),
          options: {
            name: 'Alice'
          }
        }
      }]
    }
  });

  // replace the filesystem with the fake one
  const fs = new MemoryFS();
  compiler.resolvers.normal.fileSystem = fs;
  compiler.outputFileSystem = fs;

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }

      if (stats && stats.hasErrors()) {
        reject(new Error(stats.toJson().errors));
      }

      resolve(stats);
    });
  });
};
