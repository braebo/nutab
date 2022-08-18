<script lang="ts">
	let inspector: HTMLElement
	$: console.log(inspector)
</script>

<span bind:this={inspector}>
	<slot />
</span>
