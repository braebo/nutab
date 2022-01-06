<script>
	import { showSettings } from './settingsStore'
</script>

<div id="settings-button" on:click={() => ($showSettings = !$showSettings)} class:active={$showSettings}>
	<div class="dot" />
	<div class="dot" />
	<div class="dot" />
</div>

<style>
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
		box-sizing: content-box;

		font-size: 25px;

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

		background: var(--dark-c);

		pointer-events: none;
	}
</style>
