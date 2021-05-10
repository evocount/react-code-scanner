/*
Copyright (C) EvoCount GmbH - All Rights Reserved
Unauthorized copying of this file, via any medium is strictly prohibited
Proprietary and confidential

Arwed Mett <arwed.mett@evocount.de> 2021
*/

const base = require("./base")
const { resolve } = require("path")

module.exports = {
	...base,
	mode: "development",
	devtool: "eval-source-map",
	devServer: {
		contentBase: resolve(__dirname, "./build"),
		public: "kontakt.buesum.de.localhost:3000",
		https: true,
		hot: true,
		port: 3000,
		proxy: {
			"/api/v1": {
				target: "http://localhost:8000",
				pathRewrite: { "^/api/v1": "" }
			}
		},
		historyApiFallback: true
	},
}
