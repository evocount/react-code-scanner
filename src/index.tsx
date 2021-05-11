/*
Copyright (C) EvoCount GmbH - All Rights Reserved
Unauthorized copying of this file, via any medium is strictly prohibited
Proprietary and confidential

Arwed Mett <arwed.mett@evocount.de> 2021
*/

import React from "react"
import { HTMLAttributes } from "react"
import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"

import QrScanner from "qr-scanner"


export const camera_available = () => {
	return QrScanner.hasCamera()
}


export interface Props extends HTMLAttributes<HTMLElement> {
	on_scan: (result: string) => Promise<void>
	facing_mode?: "environment" | "user"
}


export default ({
	on_scan,
	facing_mode,
	...props
}: Props) => {
	const preview = useRef<HTMLVideoElement>(document.createElement("video"))

	useEffect(() => {

		const scanner = new QrScanner(preview.current, (data: string) => {
			try {
				on_scan(data)
			} catch(exception) {
				console.error(exception)
			}
		})

		scanner.start()

		return () => {
			scanner.stop()
		}
	})

	return <video { ...props } ref={ preview } />
}
