<script>
	import { grid, gridDimensions } from './_lib/gridGenerator'
	import DebugPanel from './_lib/DebugPanel.svelte'
	import { gradient } from './_lib/utils'
	import { onMount } from 'svelte'

	onMount(() => {
		const item1 = document.querySelectorAll('.cell')[0]
		const itemX = item1.getBoundingClientRect().x
		const grid = document.querySelector('.grid')
		const gridX = grid.getBoundingClientRect().x
		const distance = itemX - gridX
		console.log({ distance })
	})
</script>

<DebugPanel />

<!-- CONTROLS -->
<h4>
	gridWidth: <input bind:value={$grid.gridWidth} type="range" min="300" max="1000" style="width: 80%;" />
</h4>
<h4>
	gridPadding: <input bind:value={$grid.gridPadding} type="range" min="20" max="500" style="width: 80%;" />
</h4>
<h4>
	itemSize: <input bind:value={$grid.itemSize} type="range" min="50" max="500" style="width: 80%;" />
</h4>

<!-- GRID -->
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
	h4 {
		display: flex;
		justify-content: flex-end;

		margin: auto;
		height: 30px;
		width: 40vw;

		line-height: 20px;
	}
</style>
