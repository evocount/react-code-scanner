/*
Copyright (C) EvoCount GmbH - All Rights Reserved
Unauthorized copying of this file, via any medium is strictly prohibited
Proprietary and confidential

Arwed Mett <mett@evocount.de> 2020
*/

const { resolve } = require("path")

module.exports = {
	mode: "development",
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
	},
	optimization: {
		usedExports: true
	}
}
