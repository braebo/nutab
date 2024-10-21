<script lang="ts">
	import { run } from 'svelte/legacy';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	let inspector: HTMLElement = $state()
	run(() => {
		console.log(inspector)
	});
</script>

<span bind:this={inspector}>
	{@render children?.()}
</span>
