module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://api.weatherlink.com/v2/',
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
        },
      },
    },
};