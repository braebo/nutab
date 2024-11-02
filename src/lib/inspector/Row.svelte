<script lang="ts">
	// import type { Writable, Readable } from 'svelte/store'

	import { nanoid } from '$lib/utils/nanoid'
	import Row from './Row.svelte'

	let {
		key,
		value,
		state,
		path,
		// simple = false,
		label = true,
		depth = $bindable(0),
	}: {
		key: string
		value: unknown
		state: unknown
		path: string
		simple?: boolean
		label?: boolean
		depth?: number
	} = $props()

	depth++

	/**
	 * A unique identifier for the row.
	 */
	const uid = nanoid(4)

	/**
	 * Sets the value at the given path in the object.
	 */
	const set = (obj: Record<string, unknown>, path: string | string[], value: unknown) => {
		// Regex explained: https://regexr.com/58j0k
		const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g)

		pathArray?.reduce((acc: Record<string, unknown>, key, i) => {
			if (acc[key] === undefined) acc[key] = {}
			if (i === pathArray.length - 1) acc[key] = value
			return acc[key] as Record<string, unknown>
		}, obj)
	}

	function updateState(value: boolean | string) {
		if (typeof state === 'object') {
			set(state as Record<string, unknown>, path, value)
		} else {
			state = value
		}
	}
</script>

<div class="kv" style:--hue={depth % 360}>
	{#if value !== null}
		{#if typeof value === 'object'}
			{#if Array.isArray(value)}
				{#if label}
					<div class="key">{key}{':'}</div>
				{/if}
				<!-- Array -->
				{#each value as nestedValue, index}
					<Row
						{key}
						{state}
						label={false}
						value={nestedValue}
						path={path + '[' + index + ']'}
					/>
				{/each}
			{:else}
				{#if label}
					<div class="key">{key}{':'}</div>
				{/if}
				<div class="nested">
					{#each Object.entries(value) as [nestedKey, nestedValue]}
						<Row
							key={nestedKey}
							value={nestedValue}
							{state}
							path={path + '.' + nestedKey}
							{depth}
						/>
					{/each}
				</div>
			{/if}
		{:else}
			<label class="store-container" for="{path}-{uid}">
				{#if label}
					<div class="key">{key}{':'}</div>
				{/if}
				{#if typeof value === 'string'}
					<input
						id={path}
						type="text"
						{value}
						oninput={(e) => updateState(e.currentTarget.value)}
					/>
				{:else if typeof value === 'boolean'}
					<input
						id="{path}-{uid}"
						type="checkbox"
						checked={value}
						onchange={(e) => {
							updateState(e.currentTarget.checked)
						}}
					/>
				{:else if typeof value === 'number'}
					<input
						id={path}
						type="number"
						{value}
						onchange={(e) => {
							updateState(e.currentTarget.value)
						}}
					/>
				{/if}
			</label>
		{/if}
	{/if}
</div>

<style lang="scss">
	.kv {
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;

		height: fit-content;
		width: 100%;
	}
	.key {
		width: 100%;

		color: var(--key-color);
		opacity: 0.9;

		font-size: var(--font-small);
	}

	.store-container {
		display: flex;
		align-items: baseline;
		justify-content: flex-start;

		width: 100%;
		margin-bottom: 2px;
	}

	input {
		flex-grow: 1;

		background: var(--background-int);
		color: var(--value-color);
		border: 0;
		border-radius: 1px;
		border-bottom: 1px solid var(--balue-);

		min-width: 100%;
		width: 100%;

		font-size: var(--font-small);
		font-family: 'MonoLisa', monospace;
	}

	// Chrome, Safari, Edge, Opera
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='checkbox'] {
		min-width: max-content;
		margin: 0 100% 0 10px;
		transform: translateY(2px);
		background-color: var(--background-int);
		filter: brightness(0.1);
		cursor: pointer;
		padding: 0 10px;
	}
	input[type='checkbox']:checked {
		filter: brightness(1);
	}

	// Firefox
	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	[type='number'] {
		width: 80px;
	}

	.nested {
		margin: 10px 0 10px 15px;
	}
</style>
