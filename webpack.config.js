var path = require('path');

module.exports = {
    context: __dirname,
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel'
        }]
    },   
    entry: "./js/main.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    resolve: {
        modulesDirectories: ['node_modules'],
    },
};
