const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function generateHtmlPlugins(templateDir) {
	const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
	return templateFiles.map((item) => {
		const parts = item.split('.');
		const name = parts[0];
		const extension = parts[1];
		return new HtmlWebpackPlugin({
			filename: `${name}.html`,
			template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
			inject: false
		});
	});
}

const htmlPlugins = generateHtmlPlugins('./src/html/views');

module.exports = {
	entry: './src/js/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env' ]
					}
				}
			},

			{
				test: /\.html$/,
				include: path.resolve(__dirname, 'src/html/includes'),
				use: [ 'raw-loader' ]
			},

			{
				test: /\.s[ac]ss$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader',
						options: {
							implementation: require('sass')
						}
					}
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([
			{
				from: './src/fonts',
				to: './fonts'
			},

			{
				from: './src/img',
				to: './img'
			},

			{
				from: './src/favicons',
				to: './src/favicons'
			}
		]),
		new MiniCssExtractPlugin({
			filename: 'bundle.css'
		})
	].concat(htmlPlugins)
};
