const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const applicationFileName = "Application";
const assetsPath = 'application/';

module.exports = {
	entry: ['./src'],
	output: {
		filename: `${applicationFileName}.js`,
		path: path.resolve(__dirname, assetsPath),
		publicPath: assetsPath,
	},
	entry: ['./src/Application.js'],
	module: {
	rules: [ 
		{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader']
			})
		},
		{
			test: /\.*(sass|scss)$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'sass-loader']
			})
		},
	]
	},
	plugins: [ 
		new ExtractTextPlugin(
			{filename: `${applicationFileName}.css`}
		)
	],
		devServer: {
		port: 9998,
		overlay: false,
	}
};
