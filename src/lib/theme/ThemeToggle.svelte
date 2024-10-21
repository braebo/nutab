<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { theme, initTheme, toggleTheme, OnMount } from 'fractils'

	import { fade, fly } from 'svelte/transition'
	import { quartOut } from 'svelte/easing'

	import Clouds from './graphics/Clouds.svelte'
	import Stars from './graphics/Stars.svelte'
	import Moon from './graphics/Moon.svelte'
	import Sun from './graphics/Sun.svelte'

	let first = $state(true)

	initTheme()

	interface Props {
		size: number;
	}

	let { size }: Props = $props();
	function handleToggle() {
		toggleTheme()
		first = false
	}
</script>

<OnMount>
	{#key $theme}
		<div class="theme-toggle" onclick={preventDefault(handleToggle)}>
			<span style:pointer-events="none">
				{#if $theme == 'light'}
					<div
						out:fade
						in:fly={{
							y: first ? -40 : 1,
							duration: first ? 2000 : 750,
							opacity: first ? 1 : 0,
							easing: quartOut,
						}}
					>
						<Sun {size} />
					</div>
					<Clouds {size} />
				{:else if $theme == 'dark'}
					<Stars {size} />
					<div
						out:fade
						in:fly={{
							y: first ? -40 : 1,
							duration: first ? 2000 : 750,
							opacity: first ? 1 : 0,
							easing: quartOut,
						}}
					>
						<Moon {size} />
					</div>
				{/if}
			</span>
		</div>
	{/key}
</OnMount>

<style lang="scss">
	.theme-toggle {
		position: absolute;
		top: 0px;

		width: 55px;
		height: 55px;

		z-index: 50;
		cursor: pointer;
		pointer-events: all;
	}
</style>
