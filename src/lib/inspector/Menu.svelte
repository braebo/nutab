<script lang="ts">
	import MacScrollbar from '$lib/ui/Scrollbar.svelte'
	import { device } from '$lib/stores/device.svelte'
	import { resize } from '$lib/utils/resizable'

	interface Link {
		text: string
		path?: string
	}

	interface Props {
		isOpen?: boolean
		right?: boolean
		top?: string
		theme?: string
		nub?: string
		links: Link[]
		position?: any
		children?: import('svelte').Snippet
		onToggle?: (e: { label: string; isOpen: boolean }) => void
	}

	let {
		isOpen = $bindable(false),
		right = false,
		top = '10px',
		theme = '',
		nub = '🚀',
		links,
		position = {
			top: '7vh',
			right: null as string | null,
			bottom: null as string | null,
			left: null as string | null,
		},
		children,
		onToggle,
	}: Props = $props()
	const css = Object.entries(position).reduce((a, b) => (b[1] ? `${a + b.join(':')};` : a), '')

	const toggle = () => {
		isOpen = !isOpen
		onToggle?.({
			label: 'menu',
			isOpen,
		})
	}

	let content = $state<HTMLElement>()

	$effect(() => {
		content?.style.setProperty(
			'max-height',
			`${device.height - content.getBoundingClientRect().top * 2}px`,
		)
	})

	let e = $state<Event>()
</script>

<div
	use:resize={{ side: 'left', color: 'hsla(0, 0%, 10%, 0.8)' }}
	style={`--sm-top: ${top};` + css}
	class="side-menu {theme}"
	id="inspector-side-menu"
	class:isOpen
	class:right
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="nub" onclick={toggle} role="button" tabindex="0">{nub}</div>
	<div class="side-menu-content" bind:this={content} onscroll={(ev) => (e = ev)}>
		<MacScrollbar root=".side-menu-content" {e} --mac-scrollbar-color="#131315" />
		<nav>
			{#each links as link}
				{#if link.path}
					<a href={link.path}>{link.text}</a>
				{:else}
					<h4>{link.text}</h4>
				{/if}
			{/each}
		</nav>
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	#inspector-side-menu {
		--color: var(--bg-a);
		--nub-bg: var(--background-int);
		--highlight: var(--fg-c);
		--lowlight: var(--fg-b);
		--background-int: var(--fg-a);
		--nub-bg: var(--background-int);
		--header-bg: var(--fg-b);
		--header-color: var(--bg-c);
		--value-color: rgb(238, 135, 0);
		--key-color: rgb(31, 102, 133);
		--font-small: 0.9em;
	}
	.side-menu {
		position: fixed;
		/* top: var(--sm-top); */
		bottom: 100vh;
		right: 0;

		width: var(--width, 300px);
		// height: calc(100vw - var(--top-position));
		height: fit-content;

		font-family: sans-serif;

		transition: transform 0.1s var(--ease_in_out_quint, cubic-bezier(0.83, 0, 0.17, 1));
		transform: translate3d(100%, 0, 0);
		z-index: var(--z, 2001);

		border-radius: 5px;
	}

	.side-menu.isOpen {
		transform: translate3d(0, 0, 0);
	}

	.side-menu .nub {
		position: absolute;
		right: 99%;
		top: 20px;

		padding: 10px;

		background: var(--nub-bg, var(--header-bg));
		border-bottom: solid 1px var(--lowlight);
		border-right: solid 1px var(--lowlight);
		border-top: solid 1px var(--highlight);
		border-radius: 5px 0 0 5px;
		box-shadow: var(
			--level-4,
			-6px 14px 28px rgba(0, 0, 0, 0.1),
			-6px 10px 10px rgba(0, 0, 0, 0.12)
		);

		cursor: pointer;
	}

	.side-menu-content {
		position: relative;
		box-sizing: border-box;

		// max-height: calc(100vh - var(--top-position));

		color: var(--color-int);
		background: var(--background-int);
		border-left: solid 1px var(--highlight);
		box-shadow: var(
			--level-4,
			0 14px 28px rgba(0, 0, 0, 0.25),
			0 10px 10px rgba(0, 0, 0, 0.22)
		);
		border-radius: 5px 0 0 5px;

		overflow-y: scroll;
		scrollbar-width: none;
		-ms-overflow-style: none;

		&::-webkit-scrollbar {
			width: 0px;
			display: none;
		}
	}

	h4 {
		margin: 0;
		padding: 4px 6px;

		background: var(--header-bg);
		color: var(--header-color, --color);
		border-bottom: solid 1px var(--lowlight);
		border-top: solid 1px var(--highlight);
		box-shadow: var(--level-2, 0 2px 3px rgba(0, 0, 0, 0.1), 0 1px 5px rgba(0, 0, 0, 0.13));

		font-size: var(--heading-font-size, 12px);
		text-transform: capitalize;

		cursor: pointer;
	}

	a {
		display: block;

		padding: 10px;

		color: var(--color);
	}
</style>
