<script lang="ts">
	import RandomizeBackground from './RandomizeBackground.svelte'
	import GradientEditor from './GradientEditor.svelte'
	import Lock from '../theme/Lock.svelte'
</script>

<div class="theme-settings">
	<div class="row shuffle">
		<RandomizeBackground />
		<Lock />
	</div>
	<GradientEditor />
</div>

<style>
	.theme-settings {
		display: flex;
		/* flex-direction: column; */
		justify-content: center;
		align-items: center;
		gap: 0.7rem;

		height: 90%;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
