import React from "react"
import { useState } from "react"
import { HTMLAttributes } from "react"
import { useEffect } from "react"
import { useRef } from "react"

import Signal from "@evocount/signal"


export const camera_available = async () => true

export interface Props extends HTMLAttributes<HTMLElement> {
	on_scan: (result: string) => Promise<void>
	on_error?: (error: Error) => Promise<void>
	facing_mode?: "environment" | "user"
}

export default ({
	on_scan,
	on_error,
	facing_mode,
	...props
}: Props) => {
	const [ loaded, set_loaded ] = useState(false)
	const preview = useRef<HTMLVideoElement>(document.createElement("video"))

	useEffect(() => {
		const cancel = new Signal;

		(async () => {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: facing_mode || "environment" }
			})

			if(!loaded) {
				preview.current.srcObject = stream
				preview.current.play()
				set_loaded(true)
			}

			const Scanner = await import("./scanner")
			const scanner = new Scanner.default(200)

			await scanner.scan(cancel, stream, on_scan)
		})()

		return () => {
			cancel.notify()
		}
	})

	return <video { ...props } ref={ preview } />
}
