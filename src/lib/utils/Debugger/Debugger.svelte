<script lang="ts">
	import { bookmarkEditor } from '$lib/stores/bookmarkEditor.svelte'
	import { activeSection } from '$lib/stores/activeSection.svelte'
	import { debug, showDebugger } from '$lib/stores/debug'
	import { settings } from '$lib/stores/settings.svelte'
	import FloatingPanel from './FloatingPanel.svelte'
	import { copy } from '$lib/utils/clipboardCopy'
	import { browser, dev } from '$app/environment'
	import { grid } from '$lib/stores/grid.svelte'
	import { fly, fade } from 'svelte/transition'
	import { localStorageStore } from 'fractils'
	import { db } from '$lib/data/db.svelte'
	import { onMount, tick } from 'svelte'
	import { DEV } from 'esm-env'

	if (dev) {
		import('../../../styles/prism.scss')
	}

	interface PrismJS extends NodeModule {
		highlightAll: () => void
	}
	let Prism: PrismJS
	const loadPrism = async () => {
		// @ts-ignore
		await import('prismjs/components/prism-core.js')
		// @ts-ignore
		await import('prismjs/components/prism-json')
		// @ts-ignore
		Prism = window.Prism
		highlight()
	}

	let timer: ReturnType<typeof setTimeout> | null = null
	// svelte-ignore non_reactive_update
	let hovering = false

	const mouseover = () => {
		if (timer) clearTimeout(timer)
		hovering = true
	}

	const mouseout = () => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			hovering = false
		}, 800)
	}

	const highlight = (_node?: HTMLElement | undefined) => {
		;(async () => {
			if (Prism) {
				try {
					Prism.highlightAll()
				} catch (err) {
					console.error(`Unable to run Prism.highlightAll: ${err}`)
				}
			}
		})()
	}

	let copied: boolean[] = $state([])
	const handleCopy = (value: Object, i: number) => {
		copy(JSON.stringify(value))
		copied[i] = true
		const uncopy = () => (copied[i] = false)
		setTimeout(uncopy, 2000)
	}

	const toggle = () => {
		$showDebugger = !$showDebugger
		highlight()
		if ($showDebugger) {
			position.y = window.innerHeight - 650 - grabZone
		}
	}

	onMount(async () => {
		if (browser) {
			loadPrism()
		}
		await tick()
	})

	const bounds = { x: 10, y: 10 }
	const position = $state({ x: 5, y: 500 })
	const grabZone = 20

	// svelte-ignore non_reactive_update
	let debugPanel: Element

	let panelWidth = $state<number>()
	let panelHeight = $state<number>()

	$effect(() => {
		if (debugPanel) {
			panelWidth = debugPanel.getBoundingClientRect().width + grabZone
			panelHeight = debugPanel.getBoundingClientRect().height + grabZone
		}
	})

	let debuggables = $state<[string, any][]>([])
	onMount(() => {
		debuggables = [
			['bookmarkEditor', bookmarkEditor.editor],
			['folderEditor', bookmarkEditor.folderEditor],
			['settings', settings],
			['activeFolder', db.activeFolder],
			['activeBookmarks', db.activeBookmarks],
			['gridDimensions', grid.dimensions],
			['grid', grid],
		]
	})

	// svelte-ignore state_referenced_locally
	const visible = localStorageStore('debuggerVisibility', Array(debuggables.length).fill(true))
</script>

{#if DEV && $showDebugger && !!$debug}
	<FloatingPanel {bounds} {position} {grabZone} {panelWidth} {panelHeight} outOfBounds={true}>
		<div
			class="debug-panel scroller vertical"
			transition:fade={{ duration: 100 }}
			bind:this={debugPanel}
		>
			<div class="debuggable one scroller">
				<!-- prettier-ignore -->
				{#each [
					['Show Debugger', $showDebugger],
					['Active Section', activeSection.value],
					['Tag Filter', db.tagFilter],
					['Show Bookmark Editor', bookmarkEditor.showBookmarkEditor],
					['Show Settings', settings.showSettings],
				] as [name, value] (value)}
					<div class="kv">
						<h6>{name}</h6>
						
						<pre use:highlight>
							<code class="language-javascript">
								<div class="store">{JSON.stringify(value, null, 2)}</div>
							</code>
						</pre>
					</div>
				{/each}
			</div>

			{#each debuggables as [name, value], i}
				{#if $visible[i]}
					<input type="checkbox" bind:checked={$visible[i]} />
					<div class="debuggable scroller">
						<h4>{name}</h4>
						<pre use:highlight>
								<code class="language-JSON language-json">{name}: {JSON.stringify(value, null, 2)}</code>
							</pre>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div
							class="copy"
							onclick={() => handleCopy(value, i)}
							role="button"
							tabindex="0"
						>
							{!copied[i] ? 'Copy' : 'Copied!'}
						</div>
					</div>
				{:else}
					<pre class="disabled">
							<input type="checkbox" bind:checked={$visible[i]} />
							{name}
						</pre>
				{/if}
			{/each}
		</div>

		<div class="mousetrap" onpointerover={mouseover} onpointerout={mouseout}></div>
	</FloatingPanel>
{/if}

{#if hovering || !!$debug}
	<button onclick={toggle} onpointerover={mouseover} transition:fly={{ y: 50 }}>
		<div class="bug">🐞</div>
	</button>
{/if}

<style lang="scss">
	.debug-panel {
		position: absolute;
		flex-wrap: no-wrap;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;

		width: 98vw;
		height: 50vh;
		margin: auto;
		padding: 20px 10px;

		border: 1px solid var(--fg-b);
		border-bottom: none;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		background: var(--fg-a);
		box-shadow: 0 0 10px 3px #00000011;

		z-index: 50;

		overflow: auto;
	}

	.debuggable {
		position: relative;

		max-width: max-content;
		height: 800px;
		padding: 10px;

		border: 1px solid rgb(var(--fg-c));
		border-radius: 5px;

		overflow-y: auto;
		resize: both;
	}

	// .debuggable:last-of-type {
	// 	margin-right: 100px;
	// }

	h4 {
		color: var(--theme-a);

		font-weight: 500;
		font-family: var(--font-b);
	}

	.kv {
		display: grid;
		align-items: center;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;

		width: 20rem;

		& h6 {
			margin-right: auto;
			width: max-content;

			color: var(--theme-a);

			font-family: var(--font-b);
			font-weight: 300;
		}

		& pre {
			width: max-content;
			min-width: 5rem;
			margin-bottom: 2rem;
			padding: 0.5rem;

			code {
				color: var(--blue) !important;
			}
		}
	}

	pre {
		width: fit-content;

		font-family: var(--font-mono);
		font-size: 13px;
	}

	.copy {
		position: absolute;
		top: 0.5rem;
		right: 1rem;

		color: var(--fg-d);

		cursor: pointer;

		&:hover {
			color: var(--blue);
		}
	}

	.one {
		width: 150px;

		max-width: 250px;

		white-space: pre-wrap;

		overflow-x: hidden;

		& pre {
			white-space: pre-wrap;

			overflow: hidden;
		}
	}

	input[type='checkbox'] {
		padding: 0 0.5rem 0 0.5rem;

		opacity: 0.5;
		filter: hue-rotate(115deg) brightness(0.9);
	}

	.disabled {
		display: flex;
		align-items: center;
		gap: 5px;

		opacity: 0.5;
		color: var(--bg-a);
	}

	.mousetrap {
		position: absolute;
		bottom: 0;
		left: 2vw;

		width: 75px;
		height: 75px;

		z-index: 100;
	}

	button {
		position: absolute;
		bottom: 0;
		left: 3vw;

		width: 45px;
		height: 45px;

		border: 1px solid color-mix(in srgb, var(--fg-b) 50%, transparent);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border-bottom: none;
		background: var(--fg-a);
		box-shadow: 0 0 8px 3px #00000009;

		z-index: 100;

		cursor: pointer;

		transform: translate(-3px, 20px);
		transition: transform 0.15s ease-out;
		&:hover {
			transform: translate(-3px, 0px);
		}

		& .bug {
			transform: translateX(-3px);
		}
	}
</style>
