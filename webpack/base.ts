import { resolve } from "path"

export default {
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
			name: "@evocount/react-code-scanner",
			type: "umd"
		}
	},
	externals: {
		"react": "commonjs react"
	}
}
