<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		children,
	}: {
		children?: Snippet
	} = $props()

	let inspector = $state<HTMLElement>()
</script>

<span bind:this={inspector}>
	{@render children?.()}
</span>
