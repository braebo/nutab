<script lang="ts">
	import type { Writable, Readable } from 'svelte/store'

	import { nanoid } from 'nanoid'

	export let key: string
	export let value: unknown
	export let store: Writable<any> | Readable<any>
	export let path: string
	export let simple = false
	export let label = true

	const uid = nanoid(4)

	const set = (obj: Writable<any>, path: string | string[], value: unknown) => {
		// Regex explained: https://regexr.com/58j0k
		const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

		pathArray.reduce((acc: Record<string, any>, key, i) => {
			if (acc[key] === undefined) acc[key] = {}
			if (i === pathArray.length - 1) acc[key] = value
			return acc[key]
		}, obj)
	}

	function updateStore(value: boolean | string) {
		// Single value
		if (simple) {
			$store = value
			// Array or Object
		} else {
			if ('update' in store)
				store.update((u) => {
					let newData = { ...u }
					set(newData, path, value)
					return newData
				})
		}
	}
</script>

{#if value !== null}
	{#if typeof value === 'object'}
		{#if Array.isArray(value)}
			{#if label}
				<span class="key">{key}{':'}</span>
			{/if}
			<!-- Array -->
			{#each value as nestedValue, index}
				<svelte:self {key} {store} label={false} value={nestedValue} path={path + '[' + index + ']'} />
			{/each}
		{:else}
			{#if label}
				<span class="key">{key}{':'}</span>
			{/if}
			<div class="nested">
				{#each Object.entries(value) as [nestedKey, nestedValue]}
					<svelte:self key={nestedKey} value={nestedValue} {store} path={path + '.' + nestedKey} />
				{/each}
			</div>
		{/if}
	{:else}
		<!-- TODO Labels are potentially not unique. MUST FIX BEFORE V1 -->
		<label class="st-container" for="{path}-{uid}">
			{#if label}
				<span class="key">{key}{':'}</span>
			{/if}
			{#if typeof value === 'string'}
				<input id={path} type="text" {value} on:input={(e) => updateStore(e.currentTarget.value)} />
			{:else if typeof value === 'boolean'}
				<input
					id="{path}-{uid}"
					type="checkbox"
					checked={value}
					on:change={(e) => {
						updateStore(e.currentTarget.checked)
					}}
				/>
			{:else if typeof value === 'number'}
				<input
					id={path}
					type="number"
					{value}
					on:change={(e) => {
						updateStore(e.currentTarget.value)
					}}
				/>
			{/if}
		</label>
	{/if}
{/if}

<style>
	.key {
		font-size: var(--font-small);
		color: var(--key-color);
		opacity: 0.9;
	}

	.st-container {
		display: flex;
		align-items: baseline;
		justify-content: flex-start;
		margin-bottom: 2px;
	}

	input {
		display: inline;
		flex-grow: 0;

		padding: 0 3px;
		margin: 0 4px;
		margin-left: 2px;

		background: var(--background-int);
		color: var(--value-color);
		border: 0;
		border-radius: 1px;
		outline-offset: 1px;

		font-size: var(--font-small);
		font-family: 'MonoLisa', monospace;
	}

	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}

	[type='number'] {
		width: 80px;
	}

	.nested {
		margin-left: 15px;
	}
</style>
