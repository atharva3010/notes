module.exports = {
  // We need the shadowMode to be set to true.
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.shadowMode = true;
        return options;
      });
    config.module
      .rule('css')
      .oneOf('vue')
      .use('vue-style-loader')
      .tap(options => {
        options.shadowMode = true;
        return options;
      });
  }
};
