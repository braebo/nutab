import { settings } from '$lib/data/settings/settingsStore'
import { activeFolder } from '$lib/data/dbStore'
import { writable, derived } from 'svelte/store'

// Used to trigger the grid's {#key} block
export const reRender = writable(false)

export const grid = derived([activeFolder, settings], ([$activeFolder, $settings]) => ({
	gridWidth: $settings.ranges.gridWidth.value,
	iconSize: $settings.ranges.iconSize.value,
	gridGap: $settings.ranges.gridGap.value,
	items: $activeFolder?.bookmarks
}))

export const gridDimensions = derived(grid, ($grid) => {
	const { iconSize, gridGap, gridWidth } = $grid

	const itemCount = $grid.items?.length

	// iconSize should include padding
	const totalItemSize = iconSize + gridGap * 2

	// determine number of columns
	const totalColumns = getItemsPerRow()
	// calculate number of items that fit in 1 row
	function getItemsPerRow() {
		for (let i = 0; i < itemCount; i++) {
			if (totalItemSize * (i + 1) > gridWidth) {
				return i
			}
		}
		// all items fit in 1 row
		return itemCount
	}

	// determine number of rows
	const totalRows = Math.ceil(itemCount / totalColumns)

	// measure the leftover space in a row
	const lengthOfItems = totalItemSize * totalColumns
	const remainingSpace = gridWidth - lengthOfItems
	const a = remainingSpace / totalColumns
	const b = a / 4
	const remainingSpacePerItem = parseFloat((a - b).toFixed(10))

	// calculate final cell size
	const cellSize = parseFloat((totalItemSize + remainingSpacePerItem).toFixed(10))
	// calculate the final grid height
	const gridHeight = cellSize * totalRows + remainingSpacePerItem
	const gridCenter = gridWidth / 2 - totalItemSize / 2

	// calculate the positions of each item
	let positions = Array(itemCount).fill('')
	function updatePositions() {
		// get x position
		const getPositionInRow = (i: number) => {
			if (totalRows > 1 || itemCount > 2)
				// this covers any grid with 3+ items
				return ((cellSize * i) % (cellSize * totalColumns - 0.1)) + remainingSpacePerItem
			// but 1 and 2 item grids need some help
			else if (itemCount === 1) {
				// very center
				return gridCenter
			} else if (itemCount === 2) {
				// center minus or plus padding
				const minGap = Math.max(gridGap, 40)
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
				x: Math.floor(getPositionInRow(i) + 10),
				y: Math.floor(getPositionInColumn(i))
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
		positions
	}
})
