/*
Copyright (C) EvoCount GmbH - All Rights Reserved
Unauthorized copying of this file, via any medium is strictly prohibited
Proprietary and confidential

Arwed Mett <arwed.mett@evocount.de> 2021
*/

const base = require("./base")

module.exports = {
	...base,
	mode: "production",
	devtool: "eval-source-map"
}
