<script lang="ts">
	import { showEditor, bookmarkEditor, editorContext, folderEditor } from '$lib/stores/bookmarkEditor'
	import { settings, showSettings } from '$lib/data/settings/settingsStore'
	import { activeBookmarks, activeFolder } from '$lib/data/dbStore'
	import { gridDimensions, grid } from '$lib/stores/gridStore'
	import { debug, showDebugger } from '$lib/stores/debugStore'
	import FloatingPanel from './FloatingPanel.svelte'
	import { localStorageStore, log } from 'fractils'
	import { copy } from '$lib/utils/clipboardCopy'
	import { fly, fade } from 'svelte/transition'
	import { browser, dev } from '$app/env'
	import { onMount, tick } from 'svelte'
	import '../../../styles/prism.css'

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

	const highlight = (node?: HTMLElement | undefined) => {
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

	let copied: boolean[] = []
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
			console.log(position.y)
		}
	}

	onMount(async () => {
		if (browser) {
			loadPrism()
		}
		await tick()
	})

	const bounds = { x: 10, y: 10 }
	const position = { x: 5, y: 500 }
	const grabZone = 20

	let debugPanel: Element

	let panelWidth: number, panelHeight: number

	$: if (debugPanel) {
		panelWidth = debugPanel.getBoundingClientRect().width + grabZone
		panelHeight = debugPanel.getBoundingClientRect().height + grabZone
	}

	let debuggables = []
	$: debuggables = [
		['$bookmarkEditor', $bookmarkEditor],
		['$folderEditor', $folderEditor],
		['$settings', $settings],
		['$activeFolder', $activeFolder],
		['$activeBookmarks', $activeBookmarks],
		['$gridDimensions', $gridDimensions],
		['grid', $grid]
	]
	const visible = localStorageStore('debuggerVisibility', Array(debuggables.length).fill(true))
</script>

<template lang="pug">

	+if('$showDebugger && $debug')
		FloatingPanel({bounds} {position} {grabZone} {panelWidth} {panelHeight})
			.debug-panel.scroller.vertical(transition:fade='{{ duration: 100 }}' bind:this='{debugPanel}')
				.debuggable.one.scroller
					+each("[['Show Debugger', $showDebugger], ['Editor Context', $editorContext], ['Show Editor', $showEditor], ['Show Settings', $showSettings]] as [name, value]")
						+key('value')
							.kv
								h6 {name}
								pre(use:highlight)
									code.language-javascript
										.store {JSON.stringify(value, null, 2)}

				+each("debuggables as [name, value], i")
					+if('$visible[i]')
						input(type='checkbox' bind:checked='{$visible[i]}')
						+key('value')
							.debuggable.scroller
								h4 {name}
								pre(use:highlight)
									code.language-JSON.language-json {name}: {JSON.stringify(value, null, 2)}
								// <JSONTree {value} />
								.copy(on:click!='{() => handleCopy(value, i)}') {!copied[i] ? 'Copy' : 'Copied!'}
						+else
							pre.disabled
								input(type='checkbox' bind:checked='{$visible[i]}')
								| {name}

			// svelte-ignore a11y-mouse-events-have-key-events
			.mousetrap(on:mouseover='{mouseover}' on:mouseout='{mouseout}')

	+if('hovering || !!$debug')
		// svelte-ignore a11y-mouse-events-have-key-events
		button(on:click='{toggle}' on:mouseover='{mouseover}' transition:fly='{{ y: 50 }}') 
			.bug 🐞

</template>

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

		border: 1px solid var(--light-b);
		border-bottom: none;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		background: var(--light-a);
		box-shadow: 0 0 10px 3px #00000011;

		z-index: 50;

		overflow: auto;
	}

	.debuggable {
		position: relative;

		max-width: max-content;
		height: 800px;
		padding: 10px;

		border: 1px solid rgb(var(--light-c));
		border-radius: 5px;

		overflow-y: auto;
		resize: both;
	}

	// .debuggable:last-of-type {
	// 	margin-right: 100px;
	// }

	h4 {
		color: var(--brand-a);

		font-weight: 500;
		font-family: var(--font-secondary);
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

			color: var(--brand-a);

			font-family: var(--font-secondary);
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

		color: var(--light-d);

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
		color: var(--dark-a);
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

		border: 1px solid rgba(var(--light-b-rgb), 0.5);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		border-bottom: none;
		background: var(--light-a);
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
