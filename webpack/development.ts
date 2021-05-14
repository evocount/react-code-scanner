import base from "./base"
import { resolve } from "path"

export default {
	...base,
	mode: "development",
	devtool: "eval-source-map"
}
