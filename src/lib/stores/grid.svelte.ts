import { settings } from '$lib/stores/settings.svelte'
import { device } from './device.svelte'
import { db } from '$lib/data/db.svelte'

class Grid {
	/**
	 * Hooked up to the grid's {#key} block.
	 */
	key = $state(false)
	width = $derived(Math.min(settings.ranges.gridWidth, device.width))
	iconSize = $derived(settings.ranges.iconSize)
	gap = $derived(settings.ranges.gridGap)
	dimensions = $derived.by(() => {
		const itemCount = db.activeBookmarks.length

		// Icon size should include padding.
		const totalItemSize = this.iconSize + this.gap * 2

		// Determine number of columns.
		// Calculate number of items that fit in 1 row.
		const getItemsPerRow = () => {
			for (let i = 0; i < itemCount; i++) {
				if (totalItemSize * (i + 1) > this.width) {
					return i
				}
			}
			// All items fit in 1 row.
			return itemCount
		}
		const totalColumns = getItemsPerRow()

		// Determine number of rows.
		const totalRows = Math.ceil(itemCount / totalColumns)

		// Measure the leftover space in a row.
		const lengthOfItems = totalItemSize * totalColumns
		const remainingSpace = this.width - lengthOfItems
		const a = remainingSpace / totalColumns
		const b = a / 4
		const remainingSpacePerItem = parseFloat((a - b).toFixed(10))

		const cellSize = parseFloat((totalItemSize + remainingSpacePerItem).toFixed(10))

		// TODO - why was remainingSpacePerItem added to the height?
		// const gridHeight = cellSize * totalRows + remainingSpacePerItem
		const gridHeight = cellSize * totalRows

		const gridCenter = this.width / 2 - totalItemSize / 2

		//* Calculate the positions of each item.
		const positions = Array.from({ length: itemCount }, () => ({ x: 0, y: 0 }))
		const updatePositions = () => {
			// Get x position.
			const getPositionInRow = (i: number) => {
				// This covers any grid with 3+ items.
				if (itemCount > 2) {
					return (
						((cellSize * i) % (cellSize * totalColumns - 0.1)) + remainingSpacePerItem
					)
				}

				// 1 should be centered.
				if (itemCount === 1) {
					return gridCenter
				}

				// 2 should be centered +/- padding.
				if (itemCount === 2) {
					const minGap = Math.max(this.gap, 40)
					const offset = i === 0 ? minGap * -1.5 : minGap * 1.5
					return gridCenter + offset
				}
			}

			// Get y position.
			const getPositionInColumn = (i: number) => {
				// Keep y steady for 1 row.
				if (totalRows <= 1) return 0
				else return Math.floor(i / totalColumns) * cellSize + remainingSpacePerItem
			}

			// Store the positions.
			for (let i = 0; i < itemCount; i++) {
				positions[i] = {
					x: Math.floor(getPositionInRow(i) ?? 0),
					y: Math.floor(getPositionInColumn(i) ?? 0),
				}
			}
		}
		updatePositions()

		return {
			lengthOfItems,
			cellSize,
			totalItemSize,
			remainingSpace,
			remainingSpacePerItem,
			totalRows,
			totalColumns,
			gridHeight,
			positions,
		}
	})

	showGuidelines = $state(false)

	constructor() {}

	/**
	 * Re-renders the grid by toggling the {@link key}.
	 */
	reRender = () => {
		console.log('%cgrid.reRender()', 'color:tomato')
		this.key = !this.key
	}
}

export const grid = new Grid()
