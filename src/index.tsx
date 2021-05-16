import React from "react"
import { ReactElement } from "react"
import { useState } from "react"
import { HTMLAttributes } from "react"
import { useEffect } from "react"
import { useRef } from "react"
import { FunctionComponent } from "react"

import Signal from "@evocount/signal"
import styled from "styled-components"

const Wrapper = styled.div`
	position: relative;
`

const StyledVideo = styled.video`
	width: 100%;
`

const AnimationWrapper = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`

export interface Props extends HTMLAttributes<HTMLElement> {
	on_scan?: (result: string) => Promise<void>
	on_error?: (error: Error) => Promise<void>
	LoadingAnimation?: FunctionComponent
	facing_mode?: "environment" | "user"
}

export default ({
	on_scan,
	on_error,
	facing_mode,
	children,
	LoadingAnimation,
	...props
}: Props): ReactElement => {
	const [ loaded, set_loaded ] = useState(false)
	const [ loading_animation, set_loading_animation ] = useState(true)
	const preview = useRef<HTMLVideoElement | null>(null)

	useEffect(() => {
		if(preview.current === null) {
			return
		}

		const cancel = new Signal;

		(async () => {
			try {
				if(preview.current === null) {
					return
				}

				const stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: facing_mode || "environment" }
				})

				if(!loaded) {
					preview.current.srcObject = stream
					preview.current.load()
					await preview.current.play()
					set_loaded(true)

					preview.current.addEventListener("loadedmetadata", () => {
						set_loading_animation(false)
					})
				}

				if(on_scan) {
					const Scanner = await import("./scanner")
					const scanner = new Scanner.default(200)
					await scanner.scan(cancel, stream, on_scan)
				}

				stream.getTracks().forEach(track => track.stop())
			} catch(exception) {
				if(on_error) {
					on_error(exception)
				} else {
					console.error(exception)
				}
			}
		})()

		return () => {
			cancel.notify()
		}
	}, [ preview ])


	return <Wrapper { ...props }>
		<StyledVideo ref={ preview }>
			{ children }
		</StyledVideo>
		{ LoadingAnimation && loading_animation &&
			<AnimationWrapper>
				<LoadingAnimation />
			</AnimationWrapper>
		}
	</Wrapper>
}
