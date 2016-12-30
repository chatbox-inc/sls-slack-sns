"use strict"

const webpack = require("webpack")

module.exports = {
    entry: './handler.js',
    output: {
        libraryTarget: 'commonjs',
        path: '.webpack',
        filename: 'dispatcher.js', // this should match the first part of function handler in serverless.yml
    },
    externals: [
        "aws-sdk","superagent"
    ],
    resolve:{
        extensions: ["", ".webpack.js", ".js" ]
    },
    target: 'node',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: __dirname,
                exclude: /node_modules/,
            },
            {
                test: /\.json$/,
                loaders: ['json'],
            },
        ],
    }
};

