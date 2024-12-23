const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      fs: false, // `fs` can't work in browsers; you may need to mock it.
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      zlib: require.resolve('browserify-zlib'),
      child_process: false,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
};




// const path = require('path');

// module.exports = {
//   // other webpack config here...
//   resolve: {
//     fallback: {
//       "fs": false,
//       "path": require.resolve("path-browserify"),
//       "url": require.resolve("url"),
//       "net": false,
//       "tls": false,
//       "assert": require.resolve("assert"),
//       "http": require.resolve("stream-http"),
//       "https": require.resolve("https-browserify"),
//       "stream": require.resolve("stream-browserify"),
//       "zlib": require.resolve("browserify-zlib"),
//       "util": require.resolve("util"),
//       "os": require.resolve("os-browserify/browser"),
//       "child_process": false
//     }
//   }
// };
