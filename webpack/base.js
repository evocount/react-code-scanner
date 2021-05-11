/*
Copyright (C) EvoCount GmbH - All Rights Reserved
Unauthorized copying of this file, via any medium is strictly prohibited
Proprietary and confidential

Arwed Mett <mett@evocount.de> 2020
*/

const { resolve } = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
	target: "web",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "ts-loader"
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	entry: {
		index: resolve(__dirname, "../src/index.tsx")
	},
	output: {
		path: resolve(__dirname, "../build"),
		filename: "[name].js",
		sourceMapFilename: "[file].map",
		library: {
			name: "react-code-scanner",
			type: "umd"
		}
	},
	externals: {
		"react": "commonjs react"
	},
	optimization: {
		usedExports: true
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{ from: "node_modules/qr-scanner/qr-scanner.min.js", to: "qr-scanner.min.js" },
				{ from: "node_modules/qr-scanner/qr-scanner-worker.min.js", to: "qr-scanner-worker.min.js" }
			]
		})
	]
}
