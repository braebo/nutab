import { defaultBookmarks } from '$lib/data/bookmarks/defaults'
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
	// items = $derived(db.activeBookmarks)
	// items = $derived(db.filteredBookmarks)
	dimensions = $derived.by(() => {
		// const itemCount = this.items?.length ?? defaultBookmarks.length
		const itemCount = db.activeBookmarks?.length ?? defaultBookmarks.length

		// iconSize should include padding
		const totalItemSize = this.iconSize + this.gap * 2

		// determine number of columns

		// calculate number of items that fit in 1 row
		const getItemsPerRow = () => {
			for (let i = 0; i < itemCount; i++) {
				if (totalItemSize * (i + 1) > this.width) {
					return i
				}
			}
			// all items fit in 1 row
			return itemCount
		}
		const totalColumns = getItemsPerRow()

		// determine number of rows
		const totalRows = Math.ceil(itemCount / totalColumns)

		// measure the leftover space in a row
		const lengthOfItems = totalItemSize * totalColumns
		const remainingSpace = this.width - lengthOfItems
		const a = remainingSpace / totalColumns
		const b = a / 4
		const remainingSpacePerItem = parseFloat((a - b).toFixed(10))

		// calculate final cell size
		const cellSize = parseFloat((totalItemSize + remainingSpacePerItem).toFixed(10))
		// calculate the final grid height
		const gridHeight = cellSize * totalRows + remainingSpacePerItem
		const gridCenter = this.width / 2 - totalItemSize / 2

		// calculate the positions of each item
		const positions = Array(itemCount).fill('')
		const updatePositions = () => {
			// get x position
			const getPositionInRow = (i: number) => {
				if (totalRows > 1 || itemCount > 2)
					// this covers any grid with 3+ items
					return (
						((cellSize * i) % (cellSize * totalColumns - 0.1)) + remainingSpacePerItem
					)
				// but 1 and 2 item grids need some help
				else if (itemCount === 1) {
					// very center
					return gridCenter
				} else if (itemCount === 2) {
					// center minus or plus padding
					const minGap = Math.max(this.gap, 40)
					const offset = i === 0 ? minGap * -1.5 : minGap * 1.5
					return gridCenter + offset
				}
			}

			// get y position
			const getPositionInColumn = (i: number) => {
				// Keep y steady for 1 row
				if (totalRows <= 1) return 0
				else return Math.floor(i / totalColumns) * cellSize + remainingSpacePerItem
			}

			// store the positions
			positions.forEach((_, i) => {
				positions[i] = {
					x: Math.floor(getPositionInRow(i) ?? 0),
					y: Math.floor(getPositionInColumn(i) ?? 0),
				}
			})
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
		this.key = !this.key
	}
}

export const grid = new Grid()
