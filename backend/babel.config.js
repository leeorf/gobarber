/**
 * To declare a preset we must follow:
 * "['preset name', configurations that we want to use]" if the preset needs configuration
 * "'preset name'" if the preset doest not need configuration
 */


 /**
  * To declare a plugin we must follow:
  * "['plugin name', configurations that we want to use]" if the preset needs configuration
  * "'plugin name'" if the preset doest not need configuration
  */
module.exports = {
  presets: [
    // This will convert the code to the node version that we are using in our machine
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['babel-plugin-module-resolver', {
      alias: {
        /**
         * Babel will be executed inside our root. So we need to specify the path
         * starting from the root
         */
        "@modules": "./src/modules",
        "@config": "./src/config",
        "@shared": "./src/shared"
      }
    }],
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ],
}
