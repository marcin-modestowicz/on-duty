// load the default config generator.
const autoprefixer = require("autoprefixer");
const path = require("path");
const genDefaultConfig = require("@storybook/react/dist/server/config/defaults/webpack.config.js");

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  config.module.rules.splice(1, 1, {
    test: /\.scss$/,
    use: [
      require.resolve("style-loader"),
      {
        loader: require.resolve("css-loader"),
        options: {
          importLoaders: 1,
          modules: true
        }
      },
      require.resolve("sass-loader"),
      {
        loader: require.resolve("postcss-loader"),
        options: {
          // Necessary for external CSS imports to work
          // https://github.com/facebookincubator/create-react-app/issues/2677
          ident: "postcss",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            autoprefixer({
              browsers: [
                ">1%",
                "last 4 versions",
                "Firefox ESR",
                "not ie < 9" // React doesn't support IE8 anyway
              ],
              flexbox: "no-2009"
            })
          ]
        }
      }
    ]
  });

  return config;
};
