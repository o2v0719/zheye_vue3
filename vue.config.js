module.exports = {
  // 自己添加打包要求：
  publicPath: process.env.NODE_ENV === 'production' ? '/zheye/' : './',
  // 通过chainWeapack自定义打包入口.
  // 去掉console
  // 安装包：npm install terser-webpack-plugin --save-dev
  chainWebpack(config) {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.optimization.minimizer('terser').tap(options => {
        options[0].terserOptions.compress.drop_console = true;
        return options;
      });
    });
  }
};
