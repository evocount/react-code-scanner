import production from "./production"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"

export default {
	...production,
	plugins: [
		new BundleAnalyzerPlugin
	]
}
