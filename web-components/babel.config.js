module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  // Because Webpack 4.x (the issue - Webpack is using old version of Acorn library (to parse the code) which does not work with optional chaining or null coalescing syntax)
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining'
  ]
};
