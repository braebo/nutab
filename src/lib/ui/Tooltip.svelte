<script lang="ts">
	import { run } from 'svelte/legacy';

	import tippy, { sticky } from 'tippy.js'
	import { onMount } from 'svelte'

	
	
	interface Props {
		content?: string;
		placement?: string;
		/**
	 * @param delay - Intro & outro delay in ms.  Default [750, 100]
	 */
		delay?: [number, number];
		interactive?: boolean;
		arrow?: boolean;
		offset?: any;
		display?: string;
		children?: import('svelte').Snippet;
	}

	let {
		content = 'Tooltip',
		placement = 'right',
		delay = [750, 100],
		interactive = false,
		arrow = true,
		offset = [0, 0],
		display = '',
		children
	}: Props = $props();
	let instance: any = $state()

	onMount(() => {
		tippy.setDefaultProps({
			moveTransition: 'transform 0.2s ease-out',
			animation: 'shift-away-subtle',
			duration: [250, 100],
			plugins: [sticky],
			delay,
		})
		// @ts-ignore
		tippy(`#${content}`, {
			content: content.split('_').join(' '),
			interactive,
			placement,
			arrow,
			offset,
			delay,
		})
		const container = document.querySelector(`#${content}`)
		// @ts-ignore
		instance = container?._tippy
	})

	run(() => {
		if (tippy && instance) instance.setContent(content.split('_').join(' '))
	});
</script>

<span id={content} style="display: {display};" class="tippy-container">
	{@render children?.()}
</span>

<style>
	#slot {
		width: 0;
		height: 0;
	}

	:global(.tippy-box[data-animation='fade'][data-state='hidden']) {
		opacity: 0;
	}

	:global(.tippy-box) {
		position: relative;

		color: var(--dark-d);
		border-radius: 4px;
		outline: 0;
		background-color: var(--light-a);
		box-shadow: 0 2px 5px #54354311;

		font-family: var(--font-b);
		font-size: 14px;
		line-height: 1.4;
		letter-spacing: 2px;

		transition-property: transform, visibility, opacity;
		z-index: 1;
	}

	:global(.tippy-box[data-placement^='top'] > .tippy-arrow) {
		bottom: 0;
	}

	:global(.tippy-box[data-placement^='top'] > .tippy-arrow:before) {
		bottom: -7px;
		left: 0;

		border-width: 8px 8px 0;
		border-top-color: initial;

		transform-origin: center top;
	}

	:global(.tippy-box[data-placement^='bottom'] > .tippy-arrow) {
		top: 0;
	}

	:global(.tippy-box[data-placement^='bottom'] > .tippy-arrow:before) {
		top: -7px;
		left: 0;

		border-width: 0 8px 8px;
		border-bottom-color: initial;

		transform-origin: center bottom;
	}

	:global(.tippy-box[data-placement^='left'] > .tippy-arrow) {
		right: 0;
	}

	:global(.tippy-box[data-placement^='left'] > .tippy-arrow:before) {
		right: -7px;

		border-width: 8px 0 8px 8px;
		border-left-color: initial;

		transform-origin: center left;
	}

	:global(.tippy-box[data-placement^='right'] > .tippy-arrow) {
		left: 0;
	}

	:global(.tippy-box[data-placement^='right'] > .tippy-arrow:before) {
		left: -7px;

		border-width: 8px 8px 8px 0;
		border-right-color: initial;

		transform-origin: center right;
	}

	:global(.tippy-box[data-inertia][data-state='visible']) {
		transition-timing-function: cubic-bezier(0.54, 1.5, 0.38, 1.11);
	}

	:global(.tippy-arrow) {
		position: relative;

		width: 16px;
		height: 16px;

		color: var(--light-a);

		z-index: 0;
	}

	:global(.tippy-arrow:before) {
		position: absolute;

		border-style: solid;
		border-color: transparent;

		content: '';
	}

	:global(.tippy-content) {
		position: relative;

		padding: 5px 9px;

		z-index: 1;
	}

	/* Animation */
	:global(.tippy-box[data-animation='shift-away-subtle'][data-state='hidden']) {
		opacity: 0;
	}
	:global(.tippy-box[data-animation='shift-away-subtle'][data-state='hidden'][data-placement^='top']) {
		transform: translateY(5px);
	}
	:global(.tippy-box[data-animation='shift-away-subtle'][data-state='hidden'][data-placement^='bottom']) {
		transform: translateY(-5px);
	}
	:global(.tippy-box[data-animation='shift-away-subtle'][data-state='hidden'][data-placement^='left']) {
		transform: translateX(5px);
	}
	:global(.tippy-box[data-animation='shift-away-subtle'][data-state='hidden'][data-placement^='right']) {
		transform: translateX(-5px);
	}
</style>
