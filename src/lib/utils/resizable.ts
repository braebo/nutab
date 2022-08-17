import { get } from 'svelte/store'
import { debounce } from './debounce'
import localStorageStore from './localStorageStore'

const inspectorSize = localStorageStore('inspectorSize', '300px')

interface ResizeOptions {
	side?: 'left' | 'right' | 'top' | 'bottom'
	/**
	 * The size of the resize handle in pixels.
	 * @default '5px'
	 */
	gutterSize?: number | string
	/**
	 * Number of `vw` units (relative % of the viewport).
	 * @default 15
	 */
	minSize?: number
	/**
	 * Number of `vw` units (relative % of the viewport).
	 * @default 75
	 */
	maxSize?: number
	onResize?: () => void
	color?: string
	/**
	 * Use a visible or invisible gutter.
	 * @default true
	 */
	visible?: boolean
	/**
	 * Persist width in local storage.
	 * @default true
	 */
	persistent?: boolean
}

const px = (size: number | string) => {
	if (typeof size === 'number') return `${size}px`
	else return size
}
const vw = (size: number | string) => {
	if (typeof size === 'number') return `${size}vw`
	else return size
}

export const resize = (node: HTMLElement, options: ResizeOptions) => {
	const {
		side = 'left',
		gutterSize = '5px',
		minSize = 15,
		maxSize = 75,
		onResize = () => {},
		color = '#1d1d1d',
		persistent = true,
	} = options

	const grabber = document.createElement('div')
	grabber.classList.add('resize-grabber')
	node.appendChild(grabber)

	if (persistent) {
		const persistentSize = get(inspectorSize)
		node.style.width = persistentSize
	}

	const direction = side === ('left' || 'right') ? 'vertical' : 'horizontal'
	const width = direction === 'vertical' ? px(gutterSize) : px(node.scrollWidth)
	const height = direction === 'vertical' ? px(node.scrollHeight) : px(gutterSize)

	if (direction === 'vertical') {
		grabber.style.top = '0'
	} else grabber.style.left = '0'

	node.style.paddingLeft = px(gutterSize)
	grabber.style.backgroundColor = color
	grabber.classList.add('grabber')
	grabber.style.height = height
	grabber.style.width = width
	grabber.style[side] = '0'
	grabber.style.cssText += `
				position: absolute;
				display: flex;
				flex-grow: 1;
				cursor: grab;
			`

	const onGrab = (e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		document.addEventListener('mousemove', onMove)
		document.addEventListener('mouseup', onUp, { once: true })
		grabber.style.cursor = 'grabbing'
	}

	node.addEventListener('mouseover', () => {
		switch (direction) {
			case 'vertical':
				grabber.style.height = px(node.scrollHeight)
				break
			case 'horizontal':
				grabber.style.width = px(node.scrollWidth)
				break

			default:
				break
		}
	})

	// grabber.addEventListener('mousedown', onGrab)

	const onMove = (e: MouseEvent) => {
		const startWidth = node.offsetWidth
		const startHeight = node.offsetHeight

		const deltaX = e.movementX
		const deltaY = e.movementY

		const minSizePx = window.innerWidth * (minSize / 100)
		const maxSizePx = window.innerWidth * (maxSize / 100)

		const newWidth = startWidth - deltaX
		const newHeight = startHeight + deltaY

		// console.log({ newWidth, newHeight })

		if (direction === 'vertical') {
			if (newWidth < minSizePx) return
			if (maxSizePx && newWidth > maxSizePx) return
			node.style.width = `${newWidth}px`
		} else {
			if (newHeight < minSizePx) return
			if (maxSizePx && newHeight > maxSizePx) return
			node.style.height = `${newHeight}px`
		}

		onResize()

		debounce(() => {
			inspectorSize.set(px(node.offsetWidth))
		}, 50)
	}

	const onUp = () => {
		document.removeEventListener('mousemove', onMove)
		grabber.style.cursor = 'grab'
	}

	document.addEventListener('mouseup', onUp)
	grabber.addEventListener('mousedown', onGrab)

	return {
		destroy: () => {
			grabber.removeEventListener('mousedown', onGrab)
			document.removeEventListener('mouseup', onUp)
			document.removeEventListener('mousemove', onMove)
		},
	}
}
