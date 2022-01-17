<script>
	import { randomBackground } from './randomBackground'

	const handleClick = () => {
		document.getElementById('svelte').style = randomBackground()
	}
</script>

<div class="randomize" on:click={() => handleClick()}>New Background</div>
