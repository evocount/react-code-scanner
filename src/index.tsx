/*
Copyright (C) EvoCount GmbH - All Rights Reserved
Unauthorized copying of this file, via any medium is strictly prohibited
Proprietary and confidential

Arwed Mett <arwed.mett@evocount.de> 2021
*/

import "image-capture"
import React from "react"
import { useState } from "react"
import { HTMLAttributes } from "react"
import { useEffect } from "react"
import { useRef } from "react"

import { MultiFormatReader } from "@zxing/library"
import { Result } from "@zxing/library"
import { Exception } from "@zxing/library"
import { NotFoundException } from "@zxing/library"
import { DecodeHintType } from "@zxing/library"
import { HTMLVisualMediaElement } from "@zxing/library"
import { HTMLCanvasElementLuminanceSource } from "@zxing/library"
import { HybridBinarizer } from "@zxing/library"
import { BinaryBitmap } from "@zxing/library"
import Signal from "@evocount/signal"

export { Result } from "@zxing/library"
export { Exception } from "@zxing/library"


export const camera_available = async () => true

export interface Props extends HTMLAttributes<HTMLElement> {
	on_scan: (result: Result) => Promise<void>
	on_error?: (error: Exception) => Promise<void>
	facing_mode?: "environment" | "user"
}


class BarcodeScanner {
	timeout: number
	reader: MultiFormatReader
	canvas: HTMLCanvasElement

	constructor(timeout: number) {
		this.timeout = timeout
		this.reader = new MultiFormatReader
		this.canvas = document.createElement("canvas")
	}

	async scan(cancel: Signal, media: MediaStream, callback: (result: Result) => Promise<void>) {
		await cancel.repeat(async () => {
			const track = media.getVideoTracks()[0]
			const capture = new ImageCapture(track)
			const frame = await capture.grabFrame()

			this.canvas.width = frame.width
			this.canvas.height = frame.height
			const context = this.canvas.getContext("2d")

			if(context) {
				context.drawImage(frame, 0, 0)
				const luminanceSource = new HTMLCanvasElementLuminanceSource(this.canvas)
				const hybridBinarizer = new HybridBinarizer(luminanceSource)
				const bitmap = new BinaryBitmap(hybridBinarizer)

				try {
					const result = this.reader.decode(bitmap)
					await callback(result)
				} catch(exception) {
					if(!(exception instanceof NotFoundException)) {
						throw exception
					}
				}
			}

			await cancel.timeout(this.timeout)
		})
	}
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

			const scanner = new BarcodeScanner(200)

			await scanner.scan(cancel, stream, on_scan)
		})()

		return () => {
			cancel.notify()
		}
	})

	return <video { ...props } ref={ preview } />
}
