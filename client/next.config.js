const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  webpack: (config, { buildId, dev }) => {
    // This allows the app to refer to files through our symlink
    config.resolve.symlinks = false
    
    //config.devtool = 'cheap-eval-source-map'
    return config
  }
})

