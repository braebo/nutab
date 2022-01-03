<script lang="ts">
	import { grid, gridDimensions } from './gridGenerator'

	import { onMount, onDestroy } from 'svelte'
	import hljs from 'highlight.js/lib/common'

	let timer: NodeJS.Timeout
	onMount(() => {
		hljs.configure({ ignoreUnescapedHTML: true })
		highlight()
	})
	onDestroy(() => clearTimeout(timer))
	function highlight() {
		timer = setTimeout(hljs.highlightAll, 200)
	}
	$: $grid, highlight()
</script>

<div class="debug-page">
	<slot>
		<!-- CONTROLS -->
		<h4>
			gridWidth: <input bind:value={$grid.gridWidth} type="range" min="300" max={window?.innerWidth * 0.9 || 1000} style="width: 80%;" />
		</h4>
		<h4>
			gridPadding: <input bind:value={$grid.gridPadding} type="range" min="20" max="500" style="width: 80%;" />
		</h4>
		<h4>
			itemSize: <input bind:value={$grid.itemSize} type="range" min="50" max="500" style="width: 80%;" />
		</h4>

		<!-- JSON -->
		{#key [$grid, $gridDimensions]}
			<div class="debug">
				<pre>
		<code class="language-json">
		$grid: {JSON.stringify(
							Object.assign(
								{
									itemSize: $grid.itemSize,
									gridWidth: $grid.gridWidth,
									gridPadding: $grid.gridPadding
								},
								{}
							),
							null,
							2
						)}</code>
		</pre>
				<pre class="scroller">
		<code class="language-json">
		$gridDimensions: {JSON.stringify($gridDimensions, null, 2)}
		</code>
		</pre>
			</div>
		{/key}
	</slot>
</div>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.3.1/styles/night-owl.min.css" />
</svelte:head>

<style>
	h4 {
		display: flex;
		justify-content: flex-end;

		margin: auto;
		height: 30px;
		width: 40vw;

		line-height: 20px;
	}
	.debug {
		position: absolute;
		display: flex;
		flex-direction: column;
		left: 0;
		top: 0;
	}
	pre {
		width: 420px;
		max-height: 80vh !important;

		background: var(--dark-c);

		overflow-x: hidden !important;
	}
</style>
