<script lang="ts">
	import Tooltip from '$lib/ui/Tooltip.svelte'

	let {
		locked = $bindable(false),
		onclick = () => {},
	}: {
		locked: boolean
		onclick: () => void
	} = $props()

	let d = $derived(
		locked
			? 'M 32.6 17.9 v -2 a 7.1 7.1 0 0 0 -14.2 0 v 2 h -5 v -2 a 12.2 12.2 0 0 1 24.2 0 v 2 h -5 z'
			: 'M 32.6 11.9 v -2 a 7.1 7.1 0 0 0 -14.2 0 v 2 h -5 v -2 a 12.2 12.2 0 0 1 24.2 0 v 8 h -5 z',
	)
</script>

<Tooltip content="{locked ? 'Unlock' : 'Lock'}_Background" delay={[250, 150]} offset={[0, 10]}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div role="button" tabindex="0" class="lock" {onclick}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			fill="none"
			viewBox="0 0 50 50"
			overflow="visible"
		>
			<path fill="currentColor" {d} />
			<path
				fill="currentColor"
				fill-rule="evenodd"
				d="M8.7 24.6a5 5 0 015-5h23.5a5 5 0 015.1 5v15a5 5 0 01-5 5.1H13.6a5 5 0 01-5-5v-15zM29 30.1c0 1.4-.7 2.5-1.7 3.2l1 4.2a.8.8 0 01-.8 1h-4.2a.8.8 0 01-.8-1l1-4.2A3.7 3.7 0 1129 30z"
				clip-rule="evenodd"
			/>
		</svg>
	</div>
</Tooltip>

<style lang="scss">
	.lock {
		width: 25px;

		color: var(--bg-d);

		cursor: pointer;
	}

	path {
		transition: 0.15s;
	}
</style>
