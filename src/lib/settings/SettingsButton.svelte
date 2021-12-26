<script>
	import { showSettings } from './settingsStore'
</script>

<div class="settings-button" on:click={() => ($showSettings = !$showSettings)}>
	<div class="dot" />
	<div class="dot" />
	<div class="dot" />
</div>

<style>
	.settings-button {
		position: absolute;
		top: 0;
		right: 3px;
		display: flex;
		flex-direction: column;

		justify-content: space-around;

		/* width: 50px; */
		height: 20px;
		margin: 15px;

		font-size: 25px;

		cursor: pointer;
	}

	.dot {
		display: flex;
		flex-direction: row;

		width: 4px;
		height: 4px;

		border-radius: 100%;

		background: var(--dark-c);
	}
</style>
