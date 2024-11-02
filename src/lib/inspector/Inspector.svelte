<script lang="ts" generics="T extends Record<string, unknown>, K extends keyof T">
	import { inspectorStore } from './inspectorStore.svelte'
	import { themer } from '$lib/theme/themer.svelte'
	import Group from './Group.svelte'
	import Menu from './Menu.svelte'

	let {
		register,
		top = '10%',
		nub = '🛠',
	}: {
		register: T
		top?: string
		nub?: string
	} = $props()

	// Persists the folded / unfolded state of the inspector submenus / groups
	let keys = Object.keys(register) as K[]
	let data = keys.map((key) => {
		const isOpen = inspectorStore.value[key as string] ?? false
		return {
			label: key,
			state: register[key],
			isOpen,
		}
	}) as { label: string; state: T[K]; isOpen: boolean }[]

	const saveOpenState = (e: { label: string; isOpen: boolean }) => {
		inspectorStore.value[e.label] = e.isOpen
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
		{#each data as _, i}
			<Group
				state={data[i].state}
				label={data[i].label}
				isOpen={data[i].isOpen}
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
