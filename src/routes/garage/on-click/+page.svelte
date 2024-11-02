<script lang="ts">
	import { click } from '$lib/utils/onClick'

	let count = $state(0)
	const keys = $state<string[]>([])

	const fn = (e: KeyboardEvent | MouseEvent) => 'key' in e && keys.push(e.key)

	$effect(() => {
		console.log($state.snapshot(keys))
	})
</script>

<div style="height: 10rem; opacity: 0;"></div>

<div use:click={{ fn, hotkey: 'meta+ctrl+1' }}>
	{'meta+ctrl+a'}
</div>

<div
	use:click={{ fn, hotkey: ['meta+ctrl+2', 'Meta+Ctrl+3'] }}
	onClick={() => {
		count++
	}}
>
	count++
</div>

<div>{count}</div>

{#each keys.slice(0, 10) as key}
	<div>{key}</div>
{/each}

<style lang="scss">
	* {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		border-radius: 0.5rem;
		padding: 1rem 1.25rem;
		width: fit-content;
		background-color: rgb(10, 10, 18);
		box-shadow:
			0.5px 0.5px 2px 0px hsla(240, 30%, 90%, 0.2) inset,
			2px 2px 8px 3px hsla(240, 30%, 80%, 0.025) inset,
			16px 10px 8px 3px hsla(240, 30%, 80%, 0.025) inset,
			2px 1px 4px 1px hsla(240, 30%, 4%, 0.3),
			3px 2px 8px 3px hsla(240, 30%, 4%, 0.1),
			17px 10px 8px 3px hsla(240, 30%, 4%, 0.05),
			3px 8px 14px 2px hsla(240, 30%, 4%, 0.1);
		outline: red;
		margin: 2rem auto;
		cursor: pointer;
		font-size: 1.3rem;
		user-select: none;
		transition: 0.15s cubic-bezier(0.175, 0.925, 0.32, 1);
		font-family: serif;

		&:active {
			scale: 0.975;
			color: hsl(240, 30%, 80%);
		}
	}
</style>
