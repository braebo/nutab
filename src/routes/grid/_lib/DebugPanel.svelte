<script lang="ts">
	import { grid, gridDimensions } from './gridGenerator'

	import { onMount, onDestroy } from 'svelte'
	import hljs from 'highlight.js/lib/common'

	let timer: NodeJS.Timeout
	onMount(async () => {
		hljs.configure({ ignoreUnescapedHTML: true })
		timer = setTimeout(hljs.highlightAll, 100)
	})
	onDestroy(() => clearTimeout(timer))
</script>

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
		<pre>
		<code class="language-json">
		$gridDimensions: {JSON.stringify($gridDimensions, null, 2)}
		</code>
		</pre>
	</div>
{/key}

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.3.1/styles/night-owl.min.css" />
</svelte:head>

<style>
	.debug {
		position: absolute;
		display: flex;
		flex-direction: column;
		left: 0;
		top: 0;
	}
</style>
