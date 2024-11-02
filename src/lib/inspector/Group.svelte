<script lang="ts">
	import { slide } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import Row from './Row.svelte'

	let {
		state,
		isOpen = $bindable(),
		label,
		onToggle,
	}: {
		state: unknown
		isOpen: boolean
		label: string
		onToggle: (e: { label: string; isOpen: boolean }) => void
	} = $props()

	const toggle = () => {
		isOpen = !isOpen
		onToggle?.({
			label,
			isOpen,
		})
	}

	console.log(state)
</script>

{#if state}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<h4 class:isOpen onclick={toggle}>
		<span>▼</span>
		{label}
	</h4>

	{#if isOpen && typeof state === 'object'}
		<div class="state-data" transition:slide={{ duration: 200, easing: quintOut }}>
			{#key state}
				{#if state === null}
					<div class="null">null</div>
				{:else if typeof state === 'object'}
					{#each Object.entries(state) as [key, value]}
						<Row {key} {value} {state} path={key} />
					{/each}
				{:else}
					<Row
						{state}
						key={label}
						value={state}
						path={label}
						simple={true}
						label={false}
					/>
				{/if}
			{/key}
		</div>
	{/if}
{/if}

<style lang="scss">
	div {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
	}

	.state-data {
		padding: 10px;
	}

	h4 {
		border-bottom: solid 1px var(--lowlight);
		border-top: solid 1px var(--highlight);
		box-shadow: var(--level-2, 0 2px 3px rgba(0, 0, 0, 0.1), 0 1px 5px rgba(0, 0, 0, 0.13));
		padding: 4px 6px;
		cursor: pointer;
		margin: 0;

		background: var(--header-bg);
		color: var(--header-color, var(--color));

		text-transform: capitalize;
		font-family: var(--font-a);
		font-family: 'MonoLisa', monospace;
		font-weight: 400;
		font-size: var(--heading-font-size, 12px);

		transition: background 0.1s var(--ease_in_out_quint);
		&:hover {
			background: color-mix(in srgb, var(--header-bg) 95%, white);
			color: color-mix(in srgb, var(--header-color, var(--color)), white 75%);
		}

		span {
			display: inline-block;
			font-size: 10px;
			transform: rotate(-90deg);
			// transition: 0.1s transform var(--ease_in_out_quint);
		}

		&.isOpen {
			span {
				transform: rotate(0turn);
			}
		}
	}

	.null {
		font-size: var(--font-small);
		font-family: 'MonoLisa', monospace;

		color: var(--value-color);
	}
</style>
