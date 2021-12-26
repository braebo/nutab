<script>
	let inspector;
	$: console.log(inspector);
</script>

<div bind:this={inspector}>
	<slot />
</div>
