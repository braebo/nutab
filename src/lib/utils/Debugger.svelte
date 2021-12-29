<script lang="ts">
	import { bookmarkEditor, editorContext } from '$lib/stores/bookmarkEditor'
	import { debug, showDebugger } from '$lib/stores/debugStore'
	import { activeFolder } from '$lib/data/dbStore'
	import { copy } from '$lib/utils/clipboardCopy'
	import { localStorageStore } from 'fractils'
	import { fly } from 'svelte/transition'
	import { browser, dev } from '$app/env'
	import { onMount } from 'svelte'
	import { log } from 'fractils'
	import '../../styles/prism.css'

	interface PrismJS extends NodeModule {
		highlightAll: () => void
	}
	let Prism: PrismJS
	const loadPrism = async () => {
		await import('prismjs/components/prism-core.js')
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
	}

	onMount(async () => {
		if (browser) {
			loadPrism()
		}
	})
</script>

<template lang="pug">

	//- svelte:head
	//- 	link(rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prism-themes@1.7.0/themes/prism-dracula.css")
	
	+if('$showDebugger && !!$debug')
		.debug-panel.scroller.vertical(transition:fly='{{ y: 1000, opacity: 1, duration: 300 }}')
			.debuggable.one.scroller
				+each("[['Show Debugger', $showDebugger], ['Editor Context', $editorContext]] as [name, value]")
					+key('value')
						.kv
							h6 {name}
							pre(use:highlight)
								code.language-javascript
									.store {JSON.stringify(value, null, 2)}

			+each("[['Bookmark Editor', $bookmarkEditor], ['Active Folder', $activeFolder], ['Active Bookmarks', $activeFolder?.bookmarks]] as [name, value], i")
				+key('value')
					.debuggable.scroller
						h4 {name}
						pre(use:highlight)
							code.language-JSON.language-json {name}: {JSON.stringify(value, null, 2)}
						// <JSONTree {value} />
						.copy(on:click!='{() => handleCopy(value, i)}') {!copied[i] ? 'Copy' : 'Copied!'}


		// svelte-ignore a11y-mouse-events-have-key-events
		.mousetrap(on:mouseover='{mouseover}' on:mouseout='{mouseout}')

	+if('hovering || !!$debug')
		// svelte-ignore a11y-mouse-events-have-key-events
		button(on:click='{toggle}' on:mouseover='{mouseover}' transition:fly='{{ y: 50 }}') 
			.bug 🐞

</template>

<style lang="scss">
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
	.debug-panel {
		flex-direction: column;
		position: absolute;
		flex-wrap: wrap;
		display: flex;
		bottom: 0;
		right: 0;
		left: 0;

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

		z-index: 99;

		overflow: auto;
	}
	.debuggable {
		position: relative;

		// width: 500px;

		max-width: max-content;
		height: 800px;
		padding: 10px;

		border: 1px solid rgb(var(--light-c));
		border-radius: 5px;

		overflow-y: auto;
		resize: both;
	}
	.debuggable:last-of-type {
		margin-right: 100px;
	}
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
			min-width: 5rem;
			width: max-content;
			// max-width: 20rem;
			margin-bottom: 2rem;
			padding: 0.5rem;

			// overflow: auto !important;

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
</style>
