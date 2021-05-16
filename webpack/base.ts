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
		"react": {
			"root": "React",
			"commonjs": "react",
			"commonjs2": "react",
			"amd": "react"
		},
		"react-dom": {
			"root": "ReactDOM",
			"commonjs": "react-dom",
			"commonjs2": "react-dom",
			"amd": "react-dom"
		}
	}
}
