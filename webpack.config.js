const path= require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'eval-source-map',
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	context: path.resolve(__dirname, 'src'),
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'images', to: 'images' },
				{ from: 'css', to: 'css' },
				// Add more patterns as needed
			],
		}),
		new HtmlWebpackPlugin({
			template: './index.html', // Path to your HTML file
			inject: 'body', // Inject styles into the body
			inlineSource: '.(css)$' // Inline CSS files
		})
	]
}

