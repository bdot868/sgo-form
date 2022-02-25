const defaults = require("@wordpress/scripts/config/webpack.config"); 

module.exports = {
  ...defaults,
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  module: {
    rules:[
        { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
        { test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/ },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader'
            },
          ]
        }
    ]
  }
};
