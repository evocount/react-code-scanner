import "image-capture"

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

export default class Scanner {
	timeout: number
	reader: MultiFormatReader
	canvas: HTMLCanvasElement

	constructor(timeout: number) {
		this.timeout = timeout
		this.reader = new MultiFormatReader
		this.canvas = document.createElement("canvas")
	}

	async decode(media: MediaStream, callback: (result: string) => Promise<void>) {
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
				await callback(result.getText())
			} catch(exception) {
				if(!(exception instanceof NotFoundException)) {
					throw exception
				}
			}
		}
	}

	async scan(cancel: Signal, media: MediaStream, callback: (result: string) => Promise<void>) {
		await cancel.repeat(async () => {
			await this.decode(media, callback)
			await cancel.timeout(this.timeout)
		})
	}
}
