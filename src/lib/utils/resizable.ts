import localStorageStore from './localStorageStore'
import { debounce } from './debounce'
import { get } from 'svelte/store'

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
	/**
	 * Use a visible or invisible gutter.
	 * @default false
	 */
	visible?: boolean
	/**
	 * Gutter css color (if visible = `true`)
	 * @default 'transparent'
	 */
	color?: string
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
// const vw = (size: number | string) => {
// 	if (typeof size === 'number') return `${size}vw`
// 	else return size
// }

export const resize = (node: HTMLElement, options: ResizeOptions) => {
	const {
		side = 'left',
		gutterSize = '3px',
		minSize = 15,
		maxSize = 75,
		onResize = () => {},
		persistent = true,
		visible = false,
		color = '#1d1d1d',
	} = options

	const grabber = document.createElement('div')
	grabber.classList.add('resize-grabber')
	node.appendChild(grabber)
	node.style.cssText += `padding-${side}: ${px(gutterSize)} !important;`

	if (persistent) {
		const persistentSize = get(inspectorSize)
		node.style.width = persistentSize
	}

	const direction = side === 'left' || side === 'right' ? 'vertical' : 'horizontal'
	const width = direction === 'vertical' ? px(gutterSize) : px(node.scrollWidth)
	const height =
		direction === 'vertical' ? px(node.clientHeight + node.scrollTop) : px(gutterSize)

	if (direction === 'vertical') {
		grabber.style.top = '0'
	} else {
		grabber.style.left = '0'
	}

	const cursor = direction === 'vertical' ? 'ew-resize' : 'ns-resize'
	grabber.style.cursor = cursor

	grabber.classList.add('grabber')
	grabber.style.cssText += `
		${side}: 0;
		width: ${width};
		height: ${height};
		background: ${visible ? color : 'transparent'};
		padding: ${px(gutterSize)};
		border-${direction === 'vertical' ? 'top' : 'left'}-${side}-radius: inherit;
		border-${direction === 'vertical' ? 'bottom' : 'right'}-${side}-radius: inherit;
		position: absolute;
		display: flex;
		flex-grow: 1;
		cursor: ${cursor};
	`

	const onGrab = (e: MouseEvent) => {
		grabber.style.cursor = 'grabbing'
		const styleEl = document.createElement('style')
		styleEl.innerHTML = `
			* { cursor: grabbing !important; }
		`
		document.head.appendChild(styleEl)
		e.preventDefault()
		e.stopPropagation()
		document.addEventListener('mousemove', onMove)
		document.addEventListener('mouseup', (e) => onUp(e, styleEl), { once: true })
	}
	grabber.addEventListener('mousedown', onGrab)

	node.addEventListener('mouseover', updateHeight)

	const debouncedUpdate = debounce(() => {
		inspectorSize.set(px(node.offsetWidth))
	}, 50)

	const onMove = (e: MouseEvent) => {
		const startWidth = node.offsetWidth
		const startHeight = node.offsetHeight

		const deltaX = e.movementX
		const deltaY = e.movementY

		const minSizePx = window.innerWidth * (minSize / 100)
		const maxSizePx = window.innerWidth * (maxSize / 100)

		const newWidth = startWidth - deltaX
		const newHeight = startHeight + deltaY

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

		// debounce(() => {
		// 	inspectorSize.set(px(node.offsetWidth))
		// }, 50)
		debouncedUpdate()
	}

	const onUp = (_e?: Event, styleEl?: HTMLStyleElement) => {
		document.removeEventListener('mousemove', onMove)
		// Remove the cursor style element.
		if (styleEl) document.head.removeChild(styleEl)
		grabber.style.cursor = cursor
	}

	document.addEventListener('mouseup', onUp)

	function updateHeight() {
		const node_rect = node.getBoundingClientRect()

		if (direction === 'vertical') {
			grabber.style.height = px(Math.min(node.scrollHeight, node_rect.height))
		} else {
			grabber.style.width = px(Math.min(node.scrollWidth, node_rect.width))
		}
	}

	updateHeight()

	return {
		destroy: () => {
			document.removeEventListener('mousemove', onMove)
			document.removeEventListener('mouseup', onUp)
			node.addEventListener('mouseover', updateHeight)
			grabber.removeEventListener('mousedown', onGrab)
		},
	}
}
