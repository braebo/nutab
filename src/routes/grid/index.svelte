<script>
	import { grid, gridDimensions } from './_lib/gridGenerator'
	import DebugPanel from './_lib/DebugPanel.svelte'
	import { gradient } from './_lib/utils'
</script>

<DebugPanel />

<div
	class="grid"
	style="
		--item-size: {$grid.itemSize}px;
		--grid-width: {$grid.gridWidth}px;
		--grid-height: {$gridDimensions.gridHeight}px;
	"
>
	{#each $grid.items as g, i}
		<div
			class="cell"
			style="
				/* stylelint-disable */
				border: 1px solid {gradient(i, $grid.items.length)};
				width: {$gridDimensions.totalItemSize}px;
				height: {$gridDimensions.totalItemSize}px;
				left: {$gridDimensions.positions[i]?.x}px;
				top: {$gridDimensions.positions[i]?.y}px;
			"
		>
			<div class="grid-item" style="background: {gradient(i, $grid.items.length)};">
				{g.title}
			</div>
		</div>
	{/each}
</div>

<style>
	.grid {
		position: relative;

		width: var(--grid-width);
		height: var(--grid-height);
		margin: 1vh auto;

		border: 1px solid gray;
		box-sizing: content-box;
		background: black;

		z-index: 10;
	}
	.cell {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.grid-item {
		width: var(--item-size);
		height: var(--item-size);
		margin: auto;

		color: white;
	}
</style>
