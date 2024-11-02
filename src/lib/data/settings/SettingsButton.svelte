<!-- 
	@component Toggles the visibility of a bookmark's settings editor panel.
 -->
<script lang="ts">
	import { cMenu } from '$lib/stores/settings.svelte'
	import { tick } from 'svelte'

	const toggleCMenu = async () => {
		if (!cMenu.visible && !cMenu.pending) {
			cMenu.visible = true
			await tick()
			cMenu.x = window.innerWidth - cMenu.el.clientWidth - 40
			cMenu.y = 20
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	id="settings-button"
	onclick={toggleCMenu}
	class:active={cMenu.visible}
	role="button"
	tabindex="0"
>
	<div class="dot"></div>
	<div class="dot"></div>
	<div class="dot"></div>
</div>

<style lang="scss">
	#settings-button {
		position: absolute;
		top: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 4px;

		height: 50px;
		width: 40px;

		font-size: 25px;

		box-sizing: content-box;
		cursor: pointer;

		transition: 150ms;
	}

	.active {
		top: 3px !important;
		gap: 10px !important;
	}

	.dot {
		display: flex;
		flex-direction: row;

		width: 4px;
		height: 4px;

		border-radius: 100%;

		background: var(--bg-c);

		pointer-events: none;
	}
</style>
