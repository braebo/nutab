<script lang="ts">
	import type { Engine } from '$lib/data/types'
	import { defaultEngines } from './Engines.svelte'
	import { activeEngine } from './searchStore'
	import Icons from './IconList.svelte'
	import { onMount } from 'svelte'
	import '$lib/utils/rotateArray'

	let engines = Array.from(defaultEngines)
	let startPosition = $activeEngine
	let input: HTMLInputElement

	$: engines
	$: aliases = []
	$: inputValue = ''
	$: query = engines[0].url + inputValue

	onMount(() => {
		setTimeout(() => {
			rotateEngines()
			startPosition = $activeEngine
			getAliases()
		}, 0)
	})

	function getAliases() {
		engines.forEach((engine, i) => {
			aliases = [...aliases, engine.alias]
		})
	}

	function selectAlias() {
		select(engines.find((engine) => engine.alias == inputValue).position)
	}
	function deselectAlias() {
		select(startPosition)
	}

	$: if (!aliases.includes(inputValue)) {
		if (input && inputValue == '') deselectAlias()
	} else {
		selectAlias()
	}

	// Key commands
	function hotkey(e) {
		switch (e) {
			case 'Enter':
				window.location.href = query
				break
			case 'ArrowUp':
				select($activeEngine + 1)
				break
			case 'ArrowDown':
				select($activeEngine - 1)
				break
			default:
				break
		}
	}

	// Icon Position
	const select = (position: number) => {
		if (position < 0) {
			position = engines.length - 1
		} else if (position > engines.length - 1) {
			position = 0
		}
		const distance = Math.abs(engines.length - $activeEngine + position)
		$activeEngine = position
		engines = engines.rotate(distance)
		input.focus()
	}

	let targetPosition = engines.find((engine) => engine.position == startPosition).position
	// Rotate array based on users default setting.
	const rotateEngines = (target = $activeEngine) => {
		targetPosition = engines.find((engine) => engine.position == target).position
		engines = engines.rotate(targetPosition)
		input.focus()
	}

	const debug = false
	let searchFocused = true
</script>

<div class="search-wrapper">
	<Icons bind:engines on:newSelection={(e) => select(e.detail.position)} {searchFocused} />

	<input
		type="text"
		id="search"
		autocomplete="off"
		bind:this={input}
		bind:value={inputValue}
		on:keydown={(e) => hotkey(e.key)}
		on:focus={() => (searchFocused = true)}
		on:blur={() => (searchFocused = false)}
	/>
</div>

{#if debug}
	<div class="debug" style="margin: auto; width: max-content; font-size: 1.5rem;">
		$activeEngine: {$activeEngine}
		<br />
		targetPosition: {targetPosition}
		<br />
		startPosition: {startPosition}
		<br />
	</div>
	<pre>{JSON.stringify(engines, null, 4).split('"').join('')}</pre>
{/if}

<style>
	#search {
		width: 400px;
		margin: 2rem auto;
		padding: 0.75rem 25px 0.7rem 3rem;

		line-height: 100%;

		color: var(--dark-a);
		border: 1px solid rgba(var(--dark-b-rgb), 0.2);
		border-radius: 20px;
		background: var(--light-a);
		box-shadow: 0 2px 5px 2px #0001;

		resize: false;
		transform: translateX(-1.4rem);
		text-align: justify;
	}

	#search:focus {
		border: 1px solid var(--brand-a);
		outline: none;
	}

	:global(#search:focus .icon) {
		opacity: 1 !important;
	}

	.search-wrapper {
		display: flex;

		width: 500px;
		margin: auto;
	}

	input {
		font-size: 15px;
	}
</style>
