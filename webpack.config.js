module.exports = {
  entry: [
    './assets/js/dashboard/main'
  ],
  output: {
    path: './assets/js/dist/dashboard',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}
