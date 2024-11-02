<script lang="ts">
	import { search_state } from './search_state.svelte'
	import { defaultEngines } from './engines'
	import { onMount, untrack } from 'svelte'
	import Icons from './IconList.svelte'

	let engines = $state(defaultEngines)
	let startPosition = $state(search_state.activeEngine)
	let input = $state<HTMLInputElement>()
	let aliases = $state<string[]>([])
	// svelte-ignore state_referenced_locally
	let query = $state(engines[0].url + search_state.searchValue)

	onMount(async () => {
		setTimeout(() => {
			rotateEngines()
			startPosition = search_state.activeEngine
			getAliases()
		}, 0)
		await new Promise((res) => setTimeout(res, 100))
		input?.focus()
	})

	function getAliases() {
		aliases = engines.map((engine) => engine.alias)
	}
	function selectAlias() {
		select(engines.find((engine) => engine.alias == search_state.searchValue)?.position ?? 0)
	}
	function deselectAlias() {
		select(startPosition ?? 0)
	}

	$effect(() => {
		search_state.searchValue
		untrack(() => {
			if (!aliases.includes(search_state.searchValue ?? '')) {
				if (input && search_state.searchValue == '') deselectAlias()
			} else {
				selectAlias()
			}
		})
	})

	// Key commands
	function hotkey(e: KeyboardEvent['key']) {
		switch (e) {
			case 'Enter':
				// Perform search
				aliases.forEach((a) => {
					if (query.startsWith(a)) {
						query = query.slice(a.length + 1)
					}
				})
				window.location.href = query
				break
			case 'ArrowUp':
				select((search_state.activeEngine ?? 0) + 1)
				break
			case 'ArrowDown':
				select((search_state.activeEngine ?? 0) - 1)
				break
			default:
				break
		}
	}

	const rotate = (array: any[], count: number) => {
		const len = array.length
		count = ((count % len) + len) % len
		return array.slice(count).concat(array.slice(0, count))
	}

	// Icon Position
	const select = (position: number) => {
		if (position < 0) {
			position = engines.length - 1
		} else if (position > engines.length - 1) {
			position = 0
		}
		const distance = Math.abs(engines.length - (search_state.activeEngine ?? 0) + position)
		search_state.activeEngine = position
		engines = rotate(engines, distance)
		input?.focus()
	}

	// svelte-ignore state_referenced_locally
	let targetPosition = $state(
		engines.find((engine) => engine.position == startPosition)?.position ?? 0,
	)

	// Rotate array based on users default setting.
	const rotateEngines = (target = search_state.activeEngine) => {
		targetPosition = engines.find((engine) => engine.position == target)?.position ?? 0
		engines = rotate(engines, targetPosition)
		input?.focus()
	}

	const debug = false
	let searchFocused = $state(true)
</script>

<div class="search-wrapper">
	<Icons bind:engines onSelect={(e) => select(e.position)} {searchFocused} />

	<!-- svelte-ignore a11y_autofocus -->
	<input
		type="text"
		id="search"
		autocomplete="off"
		bind:this={input}
		bind:value={search_state.searchValue}
		onkeydown={(e) => hotkey(e.key)}
		onfocus={() => (searchFocused = true)}
		onblur={() => (searchFocused = false)}
	/>
</div>

{#if debug}
	<div class="debug" style="margin: auto; width: max-content; font-size: 1.5rem;">
		search_state.activeEngine: {search_state.activeEngine}
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

		color: var(--bg-a);
		border: 1px solid color-mix(in srgb, var(--bg-b) 20%, transparent);
		border-radius: 20px;
		background: var(--fg-a);
		box-shadow: 0 2px 5px 2px #0001;

		text-align: justify;
		line-height: 100%;

		resize: false;
		transform: translateX(-1.4rem);
	}

	#search:focus {
		border: 1px solid var(--theme-a);
		outline: none;
	}

	:global(#search:focus .icon) {
		opacity: 1 !important;
	}

	.search-wrapper {
		display: flex;

		width: 500px;
		margin: auto;

		transform: translateX(-12px);
	}

	input {
		font-size: 15px;
	}
</style>
