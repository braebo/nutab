<script lang="ts">
	import type { Readable, Writable } from 'svelte/store'

	import { inspectorStore } from './inspectorStore'
	import Group from './Group.svelte'
	import Menu from './Menu.svelte'
	import { theme } from 'fractils'

	export let register: Record<string, Writable<unknown> | Readable<unknown>>
	export let top = '10%'
	export let nub = '🛠'

	// Persists the folded / unfolded state of the inspector submenus / groups
	let keys = Object.keys(register)
	let data = keys.map((key) => {
		const isOpen = $inspectorStore[key] ?? false
		return {
			label: key,
			store: register[key],
			isOpen,
		}
	})

	const saveOpenState = (e: CustomEvent) => {
		const { label, isOpen } = e.detail
		$inspectorStore[label] = isOpen
	}
</script>

<Menu
	theme={$theme}
	{nub}
	{top}
	links={[]}
	on:menuToggle={(e) => saveOpenState(e)}
	isOpen={$inspectorStore['menu'] ?? false}
>
	<div class="state {$theme}">
		{#each data as { label, store, isOpen }, i}
			<Group on:toggle={(e) => saveOpenState(e)} {store} {label} {isOpen} />
		{/each}
	</div>
</Menu>

<style lang="scss">
	.state {
		--value-color: var(--brand-c);
		--key-color: hsla(208, 99%, 33%, 1);
		--font-small: 0.9em;
	}

	.dark {
		--color: hsla(0, 0%, 80%, 1);
		--background-int: hsla(241, 6%, 15%, 1);
		--nub-bg: var(--background-int);
		--highlight: hsla(0, 0%, 25%, 1);
		--lowlight: hsla(0, 0%, 5%, 1);
		--header-bg: hsla(0, 0%, 10%, 1);
		--value-color: var(--brand-b);
		--key-color: hsla(208, 99%, 73%, 1);
	}

	:global(.state) {
		font-size: var(--state-tool-font-size, 14px);
		font-family: 'MonoLisa', monospace;
	}
</style>
