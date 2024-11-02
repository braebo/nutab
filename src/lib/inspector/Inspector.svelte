<script lang="ts">
	import { inspectorStore } from './inspectorStore.svelte'
	import { themer } from '$lib/theme/themer.svelte'
	import Group from './Group.svelte'
	import Menu from './Menu.svelte'

	let {
		register,
		top = '10%',
		nub = '🛠',
	}: {
		register: Record<string, unknown>
		top?: string
		nub?: string
	} = $props()

	// Persists the folded / unfolded state of the inspector submenus / groups
	let keys = Object.keys(register)
	let data = keys.map((key) => {
		const isOpen = inspectorStore.value[key] ?? false
		return {
			label: key,
			state: register[key],
			isOpen,
		}
	})

	const saveOpenState = (e: { label: string; isOpen: boolean }) => {
		const { label, isOpen } = e
		inspectorStore.value[label] = isOpen
	}
</script>

<Menu
	{nub}
	{top}
	links={[]}
	theme={themer.mode}
	onToggle={(e) => saveOpenState(e)}
	isOpen={inspectorStore.value['menu'] ?? false}
>
	<div class="state {themer.mode}">
		{#each data as { label, state, isOpen }}
			<Group
				{state}
				{label}
				{isOpen}
				onToggle={(e) => {
					saveOpenState(e)
				}}
			/>
		{/each}
	</div>
</Menu>

<style lang="scss">
	.state {
		font-size: var(--state-tool-font-size, 14px);
		font-family: 'MonoLisa', monospace;
		overflow-x: hidden;
	}
</style>
