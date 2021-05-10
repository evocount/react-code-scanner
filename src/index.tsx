/*
Copyright (C) EvoCount GmbH - All Rights Reserved
Unauthorized copying of this file, via any medium is strictly prohibited
Proprietary and confidential

Arwed Mett <arwed.mett@evocount.de> 2021
*/

import React from "react"
import { HTMLAttributes } from "react"
import { BrowserQRCodeReader } from "@zxing/browser"

export interface Props extends HTMLAttributes<HTMLElement> {
	on_success: (data: string) => Promise<void>
	on_error: (error: Error) => Promise<void>
}

export default ({
	on_success,
	on_error,
	...props
}: Props) => {

	const reader = new BrowserQRCodeReader()

	return <div { ...props }>

	</div>
}
