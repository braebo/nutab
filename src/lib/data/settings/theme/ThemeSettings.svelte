<script lang="ts">
	import RandomizeBackground from './RandomizeBackground.svelte'
	import GradientEditor from './GradientEditor.svelte'
	import Saturation from './Saturation.svelte'
	import Lock from '../theme/Lock.svelte'
</script>

<div class="theme-settings">
	<Saturation />
	<div class="row shuffle">
		<div class="col">
			<RandomizeBackground />
		</div>
		<Lock />
		<GradientEditor />
	</div>
</div>

<style>
	.theme-settings {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		height: 90%;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
</style>
